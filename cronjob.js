const cron = require('node-cron');

const { MongooseAppointment } = require('./models/Appointment');
const { MongooseTask } = require('./models/Task');
const { MongooseUser } = require('./models/User');
const { sendNotification } = require('./config/firebase');
const { isMongo, memoryDb, saveFileDb } = require('./config/db');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // =====================================================
    // APPOINTMENTS
    // =====================================================
    if (isMongo()) {
      const appointments = await MongooseAppointment.find({
        notify: true,
        startDateTime: {
          $ne: null,
          $lte: now
        }
      });

      if (appointments.length > 0) {
        const userIds = appointments.map(appointment => appointment.userId);
        const users = await MongooseUser.find({
          _id: { $in: userIds }
        });

        const userMap = new Map(
          users.map(user => [user._id.toString(), user])
        );

        for (const appointment of appointments) {
          const user = userMap.get(appointment.userId.toString());
          if (!user?.deviceToken) {
            console.log(`No device token for user: ${appointment.userId}`);
            continue;
          }

          sendNotification(
            user.deviceToken,
            appointment.appointmentTitle,
            appointment.description || 'Your appointment is starting now.'
          ).catch(error => {
            console.error(`Appointment notification failed for ${appointment._id}:`, error);
          });
        }

        const appointmentIds = appointments.map(appointment => appointment._id);
        await MongooseAppointment.updateMany(
          { _id: { $in: appointmentIds } },
          { $set: { notify: false } }
        );
      }
    } else {
      // In-Memory / File DB fallback
      const appointments = (memoryDb.appointments || []).filter(a =>
        a.notify && a.startDateTime && new Date(a.startDateTime) <= now
      );

      if (appointments.length > 0) {
        const userMap = new Map(
          (memoryDb.users || []).map(u => [String(u._id || u.id), u])
        );

        for (const appointment of appointments) {
          const user = userMap.get(String(appointment.userId));
          if (user?.deviceToken) {
            sendNotification(
              user.deviceToken,
              appointment.appointmentTitle,
              appointment.description || 'Your appointment is starting now.'
            ).catch(error => {
              console.error(`Appointment notification failed for ${appointment._id}:`, error);
            });
          }
          appointment.notify = false;
        }
        saveFileDb();
      }
    }

    // =====================================================
    // TASKS
    // =====================================================
    if (isMongo()) {
      const tasks = await MongooseTask.find({
        notify: true,
        isCompleted: false,
        startDateTime: {
          $ne: null,
          $lte: now
        }
      });

      if (tasks.length > 0) {
        const userIds = tasks.map(task => task.userId);
        const users = await MongooseUser.find({
          _id: { $in: userIds }
        });

        const userMap = new Map(
          users.map(user => [user._id.toString(), user])
        );

        for (const task of tasks) {
          const user = userMap.get(task.userId.toString());
          if (!user?.deviceToken) {
            console.log(`No device token for user: ${task.userId}`);
            continue;
          }

          sendNotification(
            user.deviceToken,
            task.taskTitle,
            'Your task is starting now.'
          ).catch(error => {
            console.error(`Task notification failed for ${task._id}:`, error);
          });
        }

        const taskIds = tasks.map(task => task._id);
        await MongooseTask.updateMany(
          { _id: { $in: taskIds } },
          { $set: { notify: false } }
        );
      }
    } else {
      // In-Memory / File DB fallback
      const tasks = (memoryDb.tasks || []).filter(t =>
        t.notify && !t.isCompleted && t.startDateTime && new Date(t.startDateTime) <= now
      );

      if (tasks.length > 0) {
        const userMap = new Map(
          (memoryDb.users || []).map(u => [String(u._id || u.id), u])
        );

        for (const task of tasks) {
          const user = userMap.get(String(task.userId));
          if (user?.deviceToken) {
            sendNotification(
              user.deviceToken,
              task.taskTitle,
              'Your task is starting now.'
            ).catch(error => {
              console.error(`Task notification failed for ${task._id}:`, error);
            });
          }
          task.notify = false;
        }
        saveFileDb();
      }
    }
  } catch (error) {
    console.error('Cron Job Error:', error);
  }
});