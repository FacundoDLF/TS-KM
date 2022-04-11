interface NotificationPayload {
  userName?: string;
  projectName?: string;
}
export const NotificationsText = {
  // 1: (payload: NotificationPayload) =>
  // `${payload.userName} has added a comment on case ${payload.projectName}`,
  2: (payload: NotificationPayload) =>
    `${payload.userName} has assigned you as a case author on the following project: ${payload.projectName}.`,
  3: (payload: NotificationPayload) =>
    `${payload.userName} has submitted the '${payload.projectName}' case for your review.`,
  4: (payload: NotificationPayload) => {
    const notificationText = `The case ${payload.projectName} was sent back to you for modifications.`;
    // notificationText += payload.unsolvedComments
    //   ? `You have ${payload.unsolvedComments} unresolved comments`
    //   : "";
    return notificationText;
  }
};
