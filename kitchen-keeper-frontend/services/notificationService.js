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
 */

export async function scheduleExpirationNotification(foodData, expirationDate) {
  const expDate = new Date(expirationDate);
  const triggerDate = new Date(expDate);
  triggerDate.setDate(triggerDate.getDate() - 1); //set to 1 day before expiration
  const foodName = foodData.name;
  const formattedDate = expirationDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  if (triggerDate < new Date()) {
    console.log(
      "⚠️ Expiration date is too soon or in the past. Skipping notification."
    );
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Food expiring soon!",
      body: `${foodName} is about to expire on ${formattedDate}`,
      sound: true,
    },
    // trigger: triggerDate,
    trigger: { seconds: 5 },
  });
  console.log(
    `🔔 Scheduled notification for ${foodName} on ${triggerDate} sent`
  );
}
