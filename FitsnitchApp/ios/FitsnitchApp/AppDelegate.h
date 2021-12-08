#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@import UserNotifications.UNUserNotificationCenter;
@import AWSPinpoint;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
+ (AWSPinpoint*) pinpoint:(AWSPinpointConfiguration*) pinpointConfiguration;
@property (nonatomic, strong) UIWindow *window;

@end
