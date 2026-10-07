const cron = require('node-cron');

const { MongooseAppointment } = require('./models/Appointment');

const { MongooseTask } = require('./models/Task');

const { MongooseUser } = require('./models/User')
const { sendNotification } = require('./config/firebase');


cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    console.log('Cron running:', now);

    // =====================================================
    // APPOINTMENTS
    // =====================================================

    const appointments = await MongooseAppointment.find({
      notify: true,
      startDateTime: {
        $lte: now
      }
    });


    if (appointments.length > 0) {
      // Get all user IDs
      const userIds = appointments.map(
        appointment => appointment.userId
      );

      // Get all users in single query
      const users = await MongooseUser.find({
        _id: { $in: userIds }
      });

      // Create user map for fast lookup
      const userMap = new Map(
        users.map(user => [
          user._id.toString(),
          user
        ])
      );

      // Send notifications
      for (const appointment of appointments) {
        const user = userMap.get(
          appointment.userId.toString()
        );

        if (!user?.deviceToken) {
          console.log(
            `No device token for user: ${appointment.userId}`
          );
          continue;
        }

        sendNotification(
          user.deviceToken,
          appointment.appointmentTitle,
          appointment.description ||
            'Your appointment is starting now.'
        ).catch(error => {
          console.error(
            `Appointment notification failed for ${appointment._id}:`,
            error
          );
        });
      }

      // Update all appointments together
      const appointmentIds = appointments.map(
        appointment => appointment._id
      );

      await MongooseAppointment.updateMany(
        {
          _id: { $in: appointmentIds }
        },
        {
          $set: {
            notify: false
          }
        }
      );

      console.log(
        `Updated ${appointmentIds.length} appointments`
      );
    }


    // =====================================================
    // TASKS
    // =====================================================

    const tasks = await MongooseTask.find({
      notify: true,
      isCompleted: false,
      startDateTime: {
        $lte: now
      }
    });


    if (tasks.length > 0) {
      // Get all user IDs
      const userIds = tasks.map(
        task => task.userId
      );

      // Get all users in single query
      const users = await MongooseUser.find({
        _id: { $in: userIds }
      });

      // Create user map
      const userMap = new Map(
        users.map(user => [
          user._id.toString(),
          user
        ])
      );

      // Send notifications
      for (const task of tasks) {
        const user = userMap.get(
          task.userId.toString()
        );

        if (!user?.deviceToken) {
          console.log(
            `No device token for user: ${task.userId}`
          );
          continue;
        }

        sendNotification(
          user.deviceToken,
          task.taskTitle,
          'Your task is starting now.'
        ).catch(error => {
          console.error(
            `Task notification failed for ${task._id}:`,
            error
          );
        });
      }

      // Update all tasks together
      const taskIds = tasks.map(
        task => task._id
      );

      await MongooseTask.updateMany(
        {
          _id: { $in: taskIds }
        },
        {
          $set: {
            notify: false
          }
        }
      );

      console.log(
        `Updated ${taskIds.length} tasks`
      );
    }

  } catch (error) {
    console.error(
      'Cron Job Error:',
      error
    );
  }
});