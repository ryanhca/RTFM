RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

## Step 1: Create project
1. Using Yeoman, create an Angular app. Don't check Sass, use Bootstrap, and don't use any of the Angular-generator
defaults.
2. Install your NPM dependencies ```npm install```.
3. Install firebase, angularfire and angular-ui-router using bower:
```bower install --save firebase angularfire angular-ui-router```. If Bower asks you to 'find a suitable version for
angular', pick the latest version of Angular and persist your selection with a ```!```.

```
Unable to find a suitable version for angular, please choose one:
    1) angular#1.2.6 which resolved to 1.2.6 and is required by angular-mocks#1.2.6, angular-scenario#1.2.6, rtfm
    2) angular#>= 1.0.8 which resolved to 1.2.6 and is required by angular-ui-router#0.2.10
    3) angular#1.2.21 which resolved to 1.2.21 and is required by angularfire#0.8.0

Prefix the choice with ! to persist it to bower.json


[?] Answer: 3!
```

4. Run ```grunt serve``` to make sure that your boilerplate install is working. You should see a Yeoman welcome page.

## Step 2: Configure Module

1. Open up ```app/scripts/app.js``` and add ```firebase``` and ```ui.router``` to your module dependencies.
2. Add a ```.config``` function and include ```$stateProvider``` and ```$urlRouterProvider``` to your injections.
3. Stub in routes for ```/login```, ```/threads``` and ```/threads/:threadId```.
4. Use ```$urlRouterProvider.otherwise()``` to configure a default URL.


```
// app.js

'use strict';

angular.module('rtfmApp', ['firebase', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login'
    })
    .state('threads', {
      url: '/threads'
    })
    .state('thread', {
      url: '/thread/:threadId'
    });
});

```

## Step 3: Create Login View

1. Open up ```index.html``` and switch Yeoman's default ```views/main.html``` view with a ```ui-view``` attribute.

***OLD***

```
<!-- Add your site or application content here -->
    <div class="container" ng-include="'views/main.html'" ng-controller="MainCtrl"></div>
```

***NEW***

```
<!-- Add your site or application content here -->
    <div class="container" ui-view></div>
```

2. Create a login view and a login controller using Yeoman.
```yo angular:view login```, ```yo angular:controller login```
3. Include your new view and controller in your ```login``` state.

```
$stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    ...
```

4. Make sure ```grunt serve``` is still running so that you can see your new view. The Yeoman boilerplate view should
be replaced with the text 'This is the login view.'

## Step 3: Set Up Environment Variables

1. Create a new file at ```/app/env.js``` and set it up like so...

```
window.env = {
  "environment": "development",
  "firebase": "https://rtfm-demo.firebaseio.com/chris"
};
```

Feel free to use my ```rtfm-demo``` firebase, or create you own at [firebase.com](https://firebase.com). If you use
my firebase, please change the base to reflect your name rather than 'chris'. For example you could use
```https://rtfm-demo.firebaseio.com/supermario```. All this will do is nest your firebase data under ```supermario``` so
that your data doesn't mix with the rest of the group's.

2. Import ```env.js``` in your ```index.html``` file so that ```window.env``` is created before the rest of your
JS files load.

```
<!--Environment vars attached to window.env-->
    <script src="env.js"></script>

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
  <script src="bower_components/jquery/jquery.js"></script>
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
  <script src="bower_components/firebase/firebase.js"></script>
  <script src="bower_components/firebase-simple-login/firebase-simple-login.js"></script>
  <script src="bower_components/angularfire/dist/angularfire.min.js"></script>
  <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<!-- endbower -->
<!-- endbuild -->
```

3. Create an EnvironmentService to make your environment variables injectable into any Angular module using yeoman:
```yo angular:service environment-service```

```
'use strict';

angular.module('rtfmApp')
  .service('EnvironmentService', function EnvironmentService($window) {
    return {
      getEnv: function () {
        return $window.env;
      }
    }
  });
```

4. Inject ```EnvironmentService``` into your ```LoginCtrl``` and assign your environment to ```$scope.env```, then
read out ```{{ env }}}``` in your ```login.html``` view to confirm that your environment variables are injecting
correctly. You should see your ```window.env``` object logged out onto your login view.

5. Add ```app/env.js``` to your

```
// Login.js

'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, EnvironmentService) {
    $scope.env = EnvironmentService.getEnv();
  });

```

```
// view/login.html

 <p>This is the login view.</p>

 <div>
     {{ env }}
 </div>

```

## Step 4: Create a Login Form

1. Open up ```login.html``` and create a text input bound to ```$scope.username``` and a button that calls
```logMeIn(username)``` when clicked.

```
<p>This is the login view.</p>

<div>
    <input type="text" ng-model="username"/>
    <button ng-click="logMeIn(username)">Log In</button>
</div>
```

2. Create the ```logMeIn``` function in your ```LoginCtrl```. Have it ```alert``` the username for now.
3. Create a function in ```EnvironmentService``` called ```saveUsername``` that accepts a username and saves it to
local storage using ```$window.localStorage.setItem('username', username);```.
4. Create another function in ```EnvironmentSerice``` called ```getUsername``` that returns the username with $window.localStorage.getItem('username');

5. Inject ```$state``` into ```LoginCtrl``` and use it to forward the user to the ```threads``` state after login.
6. Use Yeoman to create a ```views/threads.html``` view and a ```ThreadsCtrl``` controller. Add the new view and
controller to the ```threads``` state in ```app.js```.
7. Test your login and make sure that it forwards you to the stubbed threads view.


## Step 5: Create A Logged In Abstract State

You're going to want access to the uesrname through the logged-in sections of the app, and you're not going to want a
user to access the logged-in portions of the app without having a saved username.
An [abstract state](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#abstract-states)
is a quick and easy way to accomplish this.

1. Open ```app.js``` and create a new state, just after the ```login``` state. Call this state ```secure```.
It will be an abstract state with one resolved injection and one controller.
The injection will be called ```username``` and the controller will be ```SecureCtrl```.


```
// app/scripts/app.js

.state('secure', {
      abstract: true,
      controller: 'SecureCtrl',
      resolve: {
        username: function (EnvironmentService) {
          return EnvironmentService.getUsername();
        }
      }
    })
...

```

2. Use Yeoman to create ```SecureCtrl```.
3. Open up ```app/scripts/controller/secure.js``` and inject ```username``` and ```$state``` into the ```SecureCtrl```.
4. If ```username``` is missing, use ```$state.go``` to redirect to the ```login``` state.
5. Assign ```username``` to ```$scope.username```.

```
// app/scripts/controllers/secure.js

'use strict';

angular.module('rtfmApp')
  .controller('SecureCtrl', function ($scope, $state, username) {
    if (!username) {
      $state.go('login');
    }

    $scope.username = username;
  });
```

6. Open up ```app.js``` and make the ```threads``` route and the ```thread``` route child routes to ```secure```. Child
routes are only instantiated after all parent routes have resolved, and child routes have access to their parent's
scope, so we can now secure any route by making it a child to ```secure```.

```
...
.state('secure', {
      abstract: true,
      controller: 'SecureCtrl',
      resolve: {
        username: function (EnvironmentService) {
          return EnvironmentService.getUsername();
        }
      }
    })
    .state('secure.threads', {
      url: '/threads',
      templateUrl: 'views/threads.html',
      controller: 'ThreadsCtrl'
    })
    .state('secure.thread', {
      url: '/thread/:threadId'
    })
...
```

7. Open up ```threads.html``` and log out ```{{ username }}``` to make sure that the username has resolved correctly.
8. Notice that when you log in, you get a warning stating
```Error: Could not resolve 'threads' from state 'login'```. This is because your old ```threads``` view has
been replaced with ```secure.threads```, so open up ```login.js``` and fix your redirect to look like this:  ```$state.go('secure.threads');```

9. When you succeed in hitting the ```/threads``` state, you'll get a blank screen, because we forgot to add a template
with a ```ui-view``` to our ```secure``` abstract state. Parent templates need to know where to render their children,
so you'll need to add a template to the ```secure``` state. It can be as simple as ```<div ui-view></div>```, or you can
create a new template file with a ```ui-view``` and include it with ```templateUrl```.

```
// Add the simplest template to give 'secure' a place to inject it's child templates
.state('secure', {
  abstract: true,
  template: '<div ui-view>',
  controller: 'SecureCtrl',
  resolve: {
    username: function (EnvironmentService) {
      return EnvironmentService.getUsername();
    }
  }
})
```

## Step 4: Create a Thread Service and Use Firebase Refs

1. Use yeoman to create the ThreadService ```yo angular:service thread-service```.
2. Create methods named ```getThreads``` and ```getThread``` to generate AngularFire references to all threads and any
individual thread. You'll need to inject ```EnvironmentService``` to get your Firebase url and you'll need to inject
```$firebase``` to generate Firebase references (heretofore referred to as "refs").

```
// app/scripts/controllers/thread-service.js

'use strict';

angular.module('rtfmApp')
  .service('ThreadService', function ThreadService(EnvironmentService, $firebase) {
    var firebaseUrl = EnvironmentService.getEnv().firebase;

    return {
      getThreads: function () {
        return $firebase(new Firebase(firebaseUrl + '/threads'));
      },

      getThread: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId));
      }
    }
  });
```

3. Inject the ```threadsRef``` into the ```ThreadsCtrl``` using a ```resolve``` attribute in your router.

```
.state('secure.threads', {
  url: '/threads',
  templateUrl: 'views/threads.html',
  controller: 'ThreadsCtrl',
  resolve: {
    threadsRef: function (ThreadService) {
      return ThreadService.getThreads();
    }
  }
})
```

4. Open up your ```ThreadsCtrl``` located in ```threads.js```. Add ```threadsRef``` to its injections and bind
```threads.$asArray()``` to scope.

```
// app/scripts/controllers/threads.js

'use strict';

angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef) {
    $scope.threads = threadsRef.$asArray();
  });

```

***Why $asArray()???***

If you [read the docs](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebase), you'll see
that AngularFire refs generated with ```$firebase``` are meant for certain kinds of low-level Firebase transactions.
You don't want to use raw AngularFire refs very often... you want to use ```$asArray()``` or ```$asObject()``` to
convert the ref into an AngularFire array or an AngularFire object. These "arrays" and objects are designed very
specifically to work with Angular views.

AngularFire "arrays" are not true JavaScript arrays (hence the quotation marks), but they are as close as you'll get to an
array with Firebase. Firebase doesn't support JavaScript arrays for some very fundamental reasons related to data
integrity... but AngularFire "arrays" provide functionality that is very similar to the JS arrays with which you are
familiar.

You'll use ```$asObject()``` when you want to interact with the individual keys of the Firebase ref like you would with
a JS object. For instance, a single thread would be treated as an object so that you could do things like this:

```
var thread = threadRef.$asObject();
thread.title = "This is a new thread";
thread.$save();
```

Notice that we you could set the object property ```thread.title``` just as you would any JS object.

### Step 5: Set up Threads view

1. Let's set up ```threads.html``` with a list of threads, an input and a button to create a new thread, and links to
each thread's unique page.

```
<div>
    <p>Threads</p>

    <form name="newThreadForm">
        <input type="text" ng-model="newThreadTitle" placeholder="New thread title..." required/>
        <button ng-disabled="newThreadForm.$invalid" ng-click="createThread(username, newThreadTitle)">Add Thread</button>
    </form>

    <ul>
        <li ng-repeat="thread in threads">
            <a ui-sref="secure.thread({threadId: thread.$id})">
                <span>{{ thread.title }}</span>
                <span>(by {{ thread.username }})</span>
            </a>
        </li>
    </ul>
</div>
```

2. You'll need to create a function in your ```ThreadsCtrl``` named ```createThread```. This function must be attached
to ```$scope``` and should accept a username and a thread title as arguments. It will then use the AngularFire "array"
```$add``` function to add the new thread to the ```threads``` array. Once you get this working, you'll be able to
add threads in your view and watch them automatically add themselves to the threads list.

```
'use strict';

angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef) {

    $scope.threads = threadsRef.$asArray();

    $scope.threads.$loaded().then(function (threads) {
      console.log(threads);
    });

    $scope.createThread = function (username, title) {
      $scope.threads.$add({
        username: username,
        title: title
      });

    }

  });
```

### Step 6: Set Up Individual Thread Views

1. Create a ```ThreadCtrl``` and ```app/views/thread.html``` using Yeoman: ```yo angular:controller thread```, and
```yo angular:view thread```.
2. Add the new controller and view to the ```thread``` state in ```app.js```. Also create a resolve for ```thread```
that uses ```$stateParams.threadId``` and ```ThreadService.getThread()``` to inject each thread's AngularFire ref into
your new ```ThreadCtrl```.

```
.state('secure.thread', {
  url: '/thread/:threadId',
  templateUrl: 'views/thread.html',
  controller: 'ThreadCtrl',
  resolve: {
    threadRef: function (ThreadService, $stateParams) {
      return ThreadService.getThread($stateParams.threadId);
    }
  }
});
```

3. Inject ```threadRef``` into your ```ThreadCtrl``` and use AngularFire's ```$asObject``` and ```$bindTo``` methods
to bind the thread to ```$scope.thread```.

```
// app/scripts/controllers/thread.js

'use strict';

angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, threadRef) {
    var thread = threadRef.$asObject();

    thread.$bindTo($scope, 'thread');
  });

```

***Why $asObject and $bindTo???***

AngularFire refs can get converted into AngularFire "objects". These "objects" can be bound to ```$scope``` using
AngularFire's
[$bindTo](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-bindto-scope-varname)
function. This sets up 3-way binding from your view, through ```$scope``` and all the way back to your Firebase
data store. You can edit these AngularFire "objects" in place in your view and watch the changes propagate throughout
your entire app.

4. Edit ```app/views/thread.html``` to create a inputs to add comments under the thread as well as read out all
existing comments.

```
<div>
    <h1>{{ thread.title }} (by {{ thread.username }})</h1>

    <form name="newCommentForm">
        <input type="text" ng-model="newCommentText" placeholder="Write a comment..." required/>
        <button ng-disabled="newCommentForm.$invalid" ng-click="createComment(username, newCommentText)">Add Comment</button>
    </form>

    <ul>
        <li ng-repeat="comment in comments">{{ comment.username }}: {{ comment.text }}</li>
    </ul>
</div>
```

Notice how we're looping through ```comment in comments```? We're going to want each thread to have an "array" of
comments in its Firebase data structure. We haven't created the ```comments``` "array" yet, but we can create an
AngularFire ref to it anyway. Firebase will treat that ref as if it already exists, so we can loop through it and add
to it seamlessly. This will require creating a new ```getComments``` method in ```ThreadService``` and injecting this
new ```commentsRef``` into ```ThreadCtrl``` using a ```resolve``` in your ```secure.thread``` state.

This may seem like a lot of steps, but you've already gone through these steps twice with ```threadsRef``` and
```threadRef```. The new ```commentsRef``` follows the same pattern.

```
// app/scripts/services/thread-service.js

'use strict';

angular.module('rtfmApp')
  .service('ThreadService', function ThreadService(EnvironmentService, $firebase) {
    var firebaseUrl = EnvironmentService.getEnv().firebase;

    return {
      getThreads: function () {
        return $firebase(new Firebase(firebaseUrl + '/threads'));
      },

      getThread: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId));
      },

      getComments: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId + '/comments'));
      }
    }
  });

```

```
// app/scripts/app.js

.state('secure.thread', {
  url: '/thread/:threadId',
  templateUrl: 'views/thread.html',
  controller: 'ThreadCtrl',
  resolve: {
    threadRef: function (ThreadService, $stateParams) {
      return ThreadService.getThread($stateParams.threadId);
    },
    commentsRef: function (ThreadService, $stateParams) {
      return ThreadService.getComments($stateParams.threadId);
    }
  }
})
```

```
// app/scripts/controllers/thread.js

'use strict';

angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, threadRef, commentsRef) {
    var thread = threadRef.$asObject();

    thread.$bindTo($scope, 'thread');

    $scope.comments = commentsRef.$asArray();

    $scope.createComment = function (username, text) {
      $scope.comments.$add({
        username: username,
        text: text
      });
    };
  });
```

Notice that we've added a new ```$scope.createComment``` function. This will get called from the ```thread.html``` view
and add a comment to your AngularFire ```comments``` "array".

## Black Diamond

This is the seed of a functioning Angular + Firebase application. You could really take it anywhere, but a great first
step would be to use
[FirebaseSimpleLogin](https://www.firebase.com/docs/web/libraries/angular/quickstart.html#section-authentication)
to create a real login system rather than the ```localStorage``` hack that we've used here.

You'll want to create users, get the logged in user and offer a "log out" button.

Check out this [example user-service](https://gist.github.com/deltaepsilon/3b1b5cbc7ee889b2378b) if you get stuck. It's
got some more advanced code that may look confusing at first, but read through each function and try to understand what
it's doing. If you can't understand the function, skip it and circle back later. The important functions in this example
are the simple ones.

## Black Diamond Instructions

A few folks have been curious as to how they could fulfill the Black Diamond requirement. I'll go ahead and give
instructions below, and I've built out the ```black-diamond``` branch of the repo to show the Black Diamond code in
action.

Do not get frustrated by the complexity of these following steps. I've arrived at this method of Firebase authentication
over the course of multiple projects. It took me a couple of hours to complete the Black Diamond code and write these
instructions, and I know this process by heart. I would expect a less experience developer to take a day or two to
figure this out. It took me longer than that the first time that I did it.

The purpose of this walkthrough is to get your code working first and explain why it works second. I've included huge
code snippets to help you along, because some of this is just brutally difficult on your first time through, and I want
to keep your frustration levels manageable.

It gets easier. It gets much, much easier.

But everyone makes mistakes, nobody's code works the first time, and you'll never succeed if you don't have the patience
to debug your own code. Read the debug messages carefully. Remember that anything that you do in a ```resolve```
function will fail silently, so if you're not seeing an error, walk through your resolves very carefully in DevTools.

### Step 7: Create User Service

1. Use Yeoman to create a ```user-service```. Inject ```$q```, ```$firebase```, ```$firebaseSimpleLogin``` and ```EnvironmentService```.
2. Create a ```firebaseSimpleLogin``` object using the following:

```
var firebaseUrl = EnvironmentService.getEnv().firebase,
      firebase = new Firebase(firebaseUrl),
      firebaseSimpleLogin = $firebaseSimpleLogin(firebase);
```

All we're doing here is creating a raw Firebase ref to our Firebase endpoint, then passing that ref into
```$firebaseSimpleLogin``` to create a ```firebaseSimpleLogin``` object that knows about our Firebase endpoint.

3. Create functions named ```getCurrentUser```, ```register```, ```logIn```, ```logOut``` and ```getUser```.
These function will mostly rely on the ```firebaseSimpleLogin``` object, for which you should
[read the docs](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasesimplelogin).

The ```register``` function should accept a ```username``` as well as an ```email``` and a ```password```. The username
will be used for identifying the user in threads and comments.

After you've completed your user registration in the ```register``` function, use the returned promise to retrieve
the new ```currentUser``` object and create your own ```userObject``` using a Firebase object. This will enable you
to track extra user details in your Firebase data store. Make sure to save the user's email address and username to
this new ```userObject```.

Set up the ```logOut``` function to return a resolved promise. This isn't strictly necessary, but if ```logOut``` did
not return a promise, it would be the only function in ```UserService``` that didn't, and that just feels wrong.

The end result should look something like this:

```
'use strict';

angular.module('rtfmApp')
  .service('UserService', function UserService($q, $firebase, $firebaseSimpleLogin, EnvironmentService) {
    var firebaseUrl = EnvironmentService.getEnv().firebase,
      firebase = new Firebase(firebaseUrl),
      firebaseSimpleLogin = $firebaseSimpleLogin(firebase);

    return {
      getCurrentUser: function () {
        return firebaseSimpleLogin.$getCurrentUser();
      },

      register: function (username, email, password) {
        var firebasePromise = firebaseSimpleLogin.$createUser(email, password),
          userDeferred = $q.defer(),
          combinedPromise = $q.all(firebasePromise, userDeferred.promise);

        // After the Firebase user has been created, create our own user object
        firebasePromise.then(function (currentUser) {
          var userObject = $firebase(new Firebase(firebaseUrl + '/users/' + currentUser.id)).$asObject();

          userObject.username = username;
          userObject.email = currentUser.email;
          userObject.$save().then(userDeferred.resolve, userDeferred.reject);
        });

        return combinedPromise;
      },

      logIn: function (email, password) {
        return firebaseSimpleLogin.$login('password', {
          email: email,
          password: password,
          rememberMe: true // Override default session length (browser session) to be 30 days
        });
      },

      logOut: function () {
        var deferred = $q.defer();

        deferred.resolve(firebaseSimpleLogin.$logout());

        return deferred.promise;
      },

      getUser: function () {
        var deferred = $q.defer();

        firebaseSimpleLogin.$getCurrentUser().then(function (currentUser) {
          if (currentUser && currentUser.id) {
            var userRef = $firebase(new Firebase(firebaseUrl + '/users/' + currentUser.id));
            deferred.resolve(userRef.$asObject());
          } else {
            deferred.reject();
          }

        });

        return deferred.promise;
      }


    }
  });

```

### Step 8: Set Firebase Rules

Let's not forget to set up our Firebase security rules. They're simple enough.

```
{
    "rules": {
      "threads": {
        ".read": true,
        ".write": true
      },
      "users": {
        "$user": {
          ".read": "$user == auth.id",
          ".write": "$user == auth.id"
        }
      }

    }
}
```

This rules set assumes that you are working at the base of your Firebase... meaning that you're not nesting this
data under anything. In my case, that means that my Firebase endpoint is ```https://rtfm-demo.firebaseio.com```,
not ```https://rtfm-demo.firebaseio.com/chris``` or anything else that would result in nested data.

The first rule is a tad permissive, and you'd want to rethink it for production, but it states that anyone can read
or write to ```/threads```. The second rule enables authenticated users to read and write to the user object whose key
matches their authentication id. For instance, if at registration ```firebaseSimpleLogin``` returns a ```currentUser```
with an ```id``` equal to 6, then I'll save that user's selected username at ```/users/6```. This rule states that only
a ```currentUser``` with ```id``` equal to 6 can access ```/users/6```.

### Step 9: Build Out the Login View

1. Change your ```logIn``` function in ```login.js``` to accept and email and a password, then call out to
```UserService``` for a user object.
2. Create a ```register``` function in ```login.js```. It should accept a ```username```, ```email``` and a
```password```. It then uses ```UserService``` to register the user and log the user in once registration is complete.
3. Expand ```login.html``` to take advantage of these new functions.

```
// login.html

<div>
    <h3>Login</h3>

    <form name="loginForm">
        <input type="email" ng-model="login.email" placeholder="Email..." required/>
        <input type="password" ng-model="login.password" placeholder="Password..." required=""/>
        <button ng-click="logMeIn(login.email, login.password)" ng-disabled="loginForm.$invalid">Log In</button>
    </form>


    <hr>

    <h3>Register</h3>

    <form name="registerForm">
        <input type="text" ng-model="registration.username" placeholder="Username..." required/>
        <input type="email" ng-model="registration.email" placeholder="Email..." required/>
        <input type="password" ng-model="registration.password" placeholder="Password..." required/>
        <button ng-click="register(registration.username, registration.email, registration.password)">Register</button>
    </form>
</div>

```

```
// login.js

'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, UserService, $state) {
    $scope.logMeIn = function (email, password) {
      UserService.logIn(email, password).then(function (user) {
        $state.go('secure.threads');
      }, function (error) {
        alert(error);
      });

    };

    $scope.register = function (username, email, password) {
      UserService.register(username, email, password).then(function (user) {
        UserService.logIn(email, password).then(function () {
          $state.go('secure.threads');
        });

      }, function (error) {
        alert(error);
      });
    };

  });

```

### Step 10: Update the Secure Abstract View

1. Update ```app.js``` so that the ```secure``` state resolves ```currentUser``` and ```user```.
2. Update the ```secure``` state to include a ***log out*** link in its template. It doesn't have to be fancy. It just
has to call ```logOut()```.
3. Edit ```secure.js``` to inject ```currentUser``` and ```user``` and bind them to ```$scope```.
4. Create a ```logOut``` function in ```secure.js``` that uses ```UserService``` to log out the user and forward her
back to the ```login``` state. Don't forget to call ```$destroy``` on the ```user``` object to avoid a nasty
console error when the now-invalid ```user``` object attempts to update its data.

```
// app.js fragment

.state('secure', {
  abstract: true,
  template: '<a ng-click="logOut()">Log Out</a><div ui-view>',
  controller: 'SecureCtrl',
  resolve: {
    currentUser: function (UserService) {
      return UserService.getCurrentUser();
    },
    user: function (UserService) {
      return UserService.getUser();
    }
  }
})
```

```
// secure.js

'use strict';

angular.module('rtfmApp')
  .controller('SecureCtrl', function ($scope, $state, currentUser, user, UserService) {
    if (!currentUser) {
      $state.go('login');
    }

    $scope.currentUser = currentUser;

    $scope.user = user;

    $scope.logOut = function () {
      delete $scope.currentUser;

      $scope.user.$destroy(); // Stop listening... failure to stop listening results in errors.

      UserService.logOut().then(function () {
        $state.go('login');
      });
    }

  });

```
