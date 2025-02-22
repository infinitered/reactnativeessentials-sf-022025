### Chapter 12

Run `./scripts/skipTo 10` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter10` if you get stuck. (yes we want to move to chapter 10, not 11 due to some complexity that redux introduces for the purposes of this course)

# Chapter 12: Native Modules

In this chapter, we will learn how to create and use native modules in React Native. Your React Native application code may need to interact with native platform APIs that aren't provided by React Native or an existing library. You can write the integration code yourself using a Turbo Native Module.

## Tasks for this section [code-a-long] -- Android & iOS

Our app is a simple local storage app that allows users to store and retrieve data. We will create a Turbo Native Module to interact with the native platform's storage API.

### 1. `define a typed JavaScript specification` using one of the most popular JavaScript type annotation languages: Flow or TypeScript

React Native's Codegen tool generates platform-specific code for Android and iOS from a TypeScript or Flow specification, defining methods and data types for native and JavaScript runtime communication. A Turbo Native Module comprises the specification, native code, and Codegen-generated interfaces.

```tsx
// /specs/NativeLocalStorage.ts
import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
  clear(): void
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocalStorage')
```

### 2. `configure your dependency management system to run Codegen`, which converts the specification into native language interfaces

```json
// /package.json
"codegenConfig": {
  "name": "NativeLocalStorageSpec", // This name will be used later to generate headers for us, so we can choose whatever we want.
  "type": "modules", // module (modules), view (components), or all (a mix).
  "jsSrcsDir": "/specs", // relative path to the folder
  "android": {
    "javaPackageName": "com.nativelocalstorage" // inform codegen about the package name
  }
}
```

#### a. Generate Android Code

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

#### b. Generate iOS Code

```bash
cd ios
bundle install
bundle exec pod install
```

### 3. `write your native platform code using the generated interfaces` to write and hook your native code into the React Native runtime environment

#### a. Android

1. Create a new file in `android/app/src/main/java/com/nativelocalstorage/NativeLocalStorageModule.kt` and add the following code:

```kt
package com.nativelocalstorage

import android.content.Context
import android.content.SharedPreferences
import com.nativelocalstorage.NativeLocalStorageSpec
import com.facebook.react.bridge.ReactApplicationContext

class NativeLocalStorageModule(reactContext: ReactApplicationContext) : NativeLocalStorageSpec(reactContext) {

  override fun getName() = NAME

  override fun setItem(value: String, key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.putString(key, value)
    editor.apply()
  }

  override fun getItem(key: String): String? {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val username = sharedPref.getString(key, null)
    return username.toString()
  }

  override fun removeItem(key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.remove(key)
    editor.apply()
  }

  override fun clear() {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.clear()
    editor.apply()
  }

  companion object {
    const val NAME = "NativeLocalStorage"
  }
}
```

2. Create a new file in `android/app/src/main/java/com/nativelocalstorage/NativeLocalStoragePackage.kt`

```kt
package com.nativelocalstorage

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeLocalStoragePackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == NativeLocalStorageModule.NAME) {
      NativeLocalStorageModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeLocalStorageModule.NAME to ReactModuleInfo(
        name = NativeLocalStorageModule.NAME,
        className = NativeLocalStorageModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}
```

3. Update `MainApplication.kt` to include the new package:

```diff
...
+ import com.nativelocalstorage.NativeLocalStoragePackage
...
override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
+               add(NativeLocalStoragePackage())
            }
...
```

#### b. iOS

1. Open the CocoPods generated Xcode Workspace:

```bash
open ios/ReactNativeEssentials.xcworkspace/
```

2. Right click on app (`ReactNativeEssentials`) and select `New Group`, call the new group `NativeLocalStorage`.

3. In the `NativeLocalStorage` group, create `New` > `File from Template` (in the top bar) > use a `Cocoa Touch Class` > name it `RCTNativeLocalStorage` with the `Objective-C` language.

4. Rename `RCTNativeLocalStorage.m` to `RCTNativeLocalStorage.mm` making it a `Objective-C++` file.

5. Update `RCTNativeLocalStorage.h`:

```diff
#import <Foundation/Foundation.h>
+ import <NativeLocalStorageSpec/NativeLocalStorageSpec.h>

NS_ASSUME_NONNULL_BEGIN

- @interface RCTNativeLocalStorage : NSObject
+ @interface RCTNativeLocalStorage : NSObject <NativeLocalStorageSpec>

@end
```

6. Update `RCTNativeLocalStorage.mm`:

```objc
#import "RCTNativeLocalStorage.h"

static NSString *const RCTNativeLocalStorageKey = @"local-storage";

@interface RCTNativeLocalStorage()
@property (strong, nonatomic) NSUserDefaults *localStorage;
@end

@implementation RCTNativeLocalStorage

RCT_EXPORT_MODULE(NativeLocalStorage)

- (id) init {
  if (self = [super init]) {
    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:RCTNativeLocalStorageKey];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLocalStorageSpecJSI>(params);
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [self.localStorage stringForKey:key];
}

- (void)setItem:(NSString *)value
          key:(NSString *)key {
  [self.localStorage setObject:value forKey:key];
}

- (void)removeItem:(NSString *)key {
  [self.localStorage removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [self.localStorage dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

@end
```

### 4. `write your application code` using your specification

Let's update our state to look at our new Native Module instead of `react-native-mmkv`.

```diff
+ import NativeLocalStorage from '../specs/NativeLocalStorage'
...
+ const NativeStorageKey = 'favorites'
- const initFavorites = safeParse(storage.getString('favorites'), [])
+ const initFavorites = safeParse(
+   NativeLocalStorage.getItem(NativeStorageKey) ?? undefined,
+   [],
+ )
...
const toggleFavorite: ToggleFavorite = useCallback(
  gameId => {
    ...
-    storage.set('favorites', JSON.stringify(newFavorites))
+    NativeLocalStorage.setItem(JSON.stringify(newFavorites), NativeStorageKey)
  },
  [favorites, setFavorites],
)
```

### 5. Run your application and test it

```bash
yarn start
```

```bash
yarn android
```

```bash
yarn ios
```

---

[Previous: Chapter 11](./chapter11.md)
