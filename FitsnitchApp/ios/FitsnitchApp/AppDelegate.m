#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <AWSCore/AWSNSCodingUtilities.h>

@import UserNotifications;
@import AWSCore;

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif
@interface AppDelegate () <RCTBridgeDelegate>
 
@property (nonatomic, strong) EXModuleRegistryAdapter *moduleRegistryAdapter;
 
@end

#define SYSTEM_VERSION_LESS_THAN(v) ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)

static AWSPinpoint* pinpoint = nil;

@implementation AppDelegate

+(AWSPinpoint*) pinpoint:(AWSPinpointConfiguration*) pinpointConfiguration {
  if (pinpoint == nil) {
    pinpoint = [AWSPinpoint pinpointWithConfiguration:pinpointConfiguration];
    //pinpoint = [AWSPinpoint alloc];
    //pinpoint.configuration = pinpointConfiguration;
  }
  return pinpoint;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"Registerd for remote notis w device token...");
  NSString *strData = [[NSString alloc]initWithData:deviceToken encoding:NSASCIIStringEncoding];
  NSLog(@"%@",strData);
  
  if (pinpoint != nil) {
    [pinpoint.notificationManager interceptDidRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  } else {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Pinpoint instance not created" userInfo:nil];
  }

}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Failed to register: %@", error);
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  AWSDDLog.sharedInstance.logLevel = AWSDDLogLevelVerbose;
  [AWSDDLog addLogger:AWSDDTTYLogger.sharedInstance];

  NSLog(@"LaunchOptions is %@", launchOptions);
  
#ifdef FB_SONARKIT_ENABLED
  //InitializeFlipper(application);
#endif

  RCTBridge *bridge = [self.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [self.reactDelegate createRootViewWithBridge:bridge
                                                   moduleName:@"FitsnitchApp"
                                            initialProperties:nil];
  
  
  
  // Instantiate Pinpoint
  AWSPinpointConfiguration *pinpointConfiguration = [AWSPinpointConfiguration defaultPinpointConfigurationWithLaunchOptions:launchOptions];
  //AWSPinpointConfiguration
  //  .defaultPinpointConfiguration(launchOptions: launchOptions);
  // Set debug mode to use APNS sandbox, make sure to toggle for your production app
  pinpointConfiguration.debug = true;
  pinpoint = [AppDelegate pinpoint:pinpointConfiguration];

  // Present the user with a request to authorize push notifications
  //AppDelegate registerForPushNotifications();
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  
  ////////Set Custom Notification Category for calling users
  
  UNNotificationAction *callUser = [UNNotificationAction actionWithIdentifier:@"CALL_USER" title:@"Call Friend" options:UNNotificationActionOptionNone];
  NSArray *actions = @[callUser];
  NSArray *empty = @[];
  
  UNNotificationCategory *snitchCategory = [UNNotificationCategory categoryWithIdentifier:@"SNITCH" actions:actions intentIdentifiers:empty hiddenPreviewsBodyPlaceholder:@"" options:UNNotificationCategoryOptionCustomDismissAction];
  
  [UNUserNotificationCenter.currentNotificationCenter setNotificationCategories:[NSSet setWithObject:snitchCategory]];
  
  ////////Notification Authorization
  
  UNAuthorizationOptions authOptions =
  UNAuthorizationOptionAlert
  | UNAuthorizationOptionSound
  | UNAuthorizationOptionBadge;
  
  [UNUserNotificationCenter.currentNotificationCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
    if (settings.authorizationStatus == UNAuthorizationStatusDenied) { //inform user why notifications should be allowed
      
    }
  }];
  
  [UNUserNotificationCenter.currentNotificationCenter requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      NSLog(@"Notification Access Granted");
      //get notification settings
      [UNUserNotificationCenter.currentNotificationCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
        //NSLog(@"Notification Settings: %d", settings);
        
        if (settings.authorizationStatus == UNAuthorizationStatusAuthorized) {
          dispatch_async(dispatch_get_main_queue(), ^(void){
            [UIApplication.sharedApplication registerForRemoteNotifications];
          });
        }
      }];
    } else {
      NSLog(@"Notification Access Not Granted");
    }
  }];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [self.reactDelegate createRootViewController];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  if (application.applicationState == UIApplicationStateActive) {
    UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"Notification Received" message:userInfo.description preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleDefault handler:nil]];
    
    [UIApplication.sharedApplication.keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
  }
  
  if (pinpoint != nil) {
    [pinpoint.notificationManager interceptDidReceiveRemoteNotification:userInfo];
  } else {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Pinpoint instance not created" userInfo:nil];
  }
  
  completionHandler(UIBackgroundFetchResultNewData);
}

-(void) userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  if (pinpoint != nil) {
    [pinpoint.notificationManager interceptDidReceiveRemoteNotification:notification.request.content.userInfo];
  } else {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Pinpoint instance not created" userInfo:nil];
  }
  
  completionHandler(UNNotificationPresentationOptionBadge);
}

-(void) userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  if ([response.actionIdentifier isEqualToString:@"CALL_USER"]) {
    NSString* phoneNumber = [@"tel:" stringByAppendingString:@"14356591485"];
    NSURL* phoneNumberUrl = [NSURL URLWithString:phoneNumber];
    if ([UIApplication.sharedApplication canOpenURL:phoneNumberUrl]) {
      if (@available(iOS 13.0, *)) {
        UISceneOpenExternalURLOptions* sceneOptions = [UISceneOpenExternalURLOptions alloc];
        sceneOptions.universalLinksOnly = false;
        [UIApplication.sharedApplication openURL:phoneNumberUrl options:@{} completionHandler:^(BOOL success) {
          if (success) {
            NSLog(@"URL Opened, calling user");
          } else {
            NSLog(@"URL failed to open");
          }
        }];
      } else {
        // Fallback on earlier versions
      }
    }
  }
  
  if (pinpoint != nil) {
    [pinpoint.notificationManager interceptDidReceiveRemoteNotification:response.notification.request.content.userInfo];
  } else {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Pinpoint instance not created" userInfo:nil];
  }
  
  completionHandler();
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
