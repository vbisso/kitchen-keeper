import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

//config how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//asks users for notification permissions
export async function registerForNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("no permissions granted");
    return false;
  }

  return true;
}

/**
 * scheduling notifications for food items
 * @param {string} foodName - Name of the food item
 * @param {string | Date} expirationDate - Date of expiration in stirng format or Date object
 *  @param {number} daysBefore - How many days before to notify (default 1)
 */

export async function scheduleExpirationNotification(
  foodData,
  expirationDate,
  daysBefore = 1
) {
  const expDate = new Date(expirationDate);
  const triggerDate = new Date(expDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore); //set to 1 day before expiration

  // Force notification to fire at 9 AM local time
  triggerDate.setHours(12, 0, 0, 0);

  // Logging for debugging
  console.log("Trigger date (UTC):", triggerDate.toISOString());
  // console.log("Now (UTC):", new Date().toISOString());

  const foodName = foodData.name;
  // const formattedDate = expirationDate.toLocaleDateString("en-US", {
  //   weekday: "long",
  //   day: "2-digit",
  //   month: "short",
  // });

  if (triggerDate.getTime() <= Date.now()) {
    console.log("⚠️ Notification trigger is in the past. Skipping.");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Food expiring soon!",
      body: `${foodData.name} expires on ${expDate.toDateString()}`,
      sound: true,
    },
    trigger: {
      type: "date",
      date: triggerDate,
    },
    // trigger: { seconds: 5 },
  });
  console.log(
    `🔔 Scheduled notification for ${foodName} on ${triggerDate} sent`
  );
}
