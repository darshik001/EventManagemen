const cron = require('node-cron');

const { MongooseAppointment } = require('./models/Appointment');

const { MongooseTask } = require('./models/Task');

const { MongooseUser } = require('./models/User')
const { sendNotification } = require('./config/firebase');

// તમારું notification function
// const sendNotification = async (userId, title, body) => {
//   try {
//     console.log('Sending notification:', {
//       userId,
//       title,
//       body
//     });

//     // અહીં તમારું FCM notification code આવશે

//   } catch (error) {
//     console.error('Notification error:', error);
//   }
// };


// Cron: દર 1 minute
cron.schedule('* * * * *', async () => {

    try {

        const now = new Date();

        console.log('Cron running:', now);


        // =========================
        // APPOINTMENTS
        // =========================
       const a = await MongooseAppointment.find()
       console.log(a)
        const appointments = await MongooseAppointment.find({
            notify: true,
            startDateTime: {
                $lte: now
            }
        });

        console.log(appointments)

        const userIds = appointments.map(
            appointment => appointment.userId
        );

        const users = await MongooseUser.find({
            _id: { $in: userIds }
        });

        for (const appointment of appointments) {
            const user = users.find(user => user._id.toString() === appointment.userId.toString());

            await sendNotification(
                user.deviceToken,
                appointment.appointmentTitle,
                appointment.description || 'Your appointment is starting now.'
            );
        }


        // =========================
        // TASKS
        // =========================

        // const tasks = await MongooseTask.find({
        //   notify: true,
        //   isCompleted: false,
        //   startDateTime: {
        //     $lte: now
        //   }
        // });

        // for (const task of tasks) {

        //   await sendNotification(
        //     task.userId,
        //     task.taskTitle,
        //     'Your task is starting now.'
        //   );

        //   // Duplicate notification અટકાવવા
        //   await MongooseTask.updateOne(
        //     { _id: task._id },
        //     {
        //       $set: {
        //         notify: false
        //       }
        //     }
        //   );
        // }

    } catch (error) {

        console.error('Cron Job Error:', error);

    }

});