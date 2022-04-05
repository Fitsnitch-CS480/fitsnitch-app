#import <React/RCTBridgeDelegate.h>
#import <Expo/Expo.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@import UserNotifications.UNUserNotificationCenter;
@import AWSPinpoint;
 
@interface AppDelegate : EXAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
+ (AWSPinpoint*) pinpoint:(AWSPinpointConfiguration*) pinpointConfiguration;
@property (nonatomic, strong) UIWindow *window;

@end
