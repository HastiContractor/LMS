const Notification = require("../models/Notification");

// Send Notification
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const notification = new Notification({
      user: userId,
      message,
    });

    await notification.save();
    res.json({ message: "Notification sent", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Notifications for a User
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, { read: true });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
