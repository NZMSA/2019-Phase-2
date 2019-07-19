# Unit Testing

For those of you lucky souls who have already learnt about Unit Testing at uni or elsewhere, you can [skip](#writing-unit-tests-for-scribrapi) the following section, which contains background info.

## About Unit Testing

Unit Testing is a form of Automated Testing, which is simply the practice of writing code that tests your application code. An individual test will pass some inputs to your code and make sure that the outputs are correct. If they aren't, the test fails. Otherwise, it passes. A Unit Test is the lowest form of test and tests an individual _unit_ of software - that is, individual methods/functions and classes.

There are quite a few other categories of software testing. The main other kind of automated test that you'll hear talked about is the integration test, which tests multiple parts of your software working together along with external dependencies such as databases (making sure your units work when you put them together). We won't be covering integration testing as it's more important for projects of bigger scope, but it's good to be aware of what it is.

### Why do we Unit Test?

Everyone, no matter how much or little they plan it, tests their code. Surely at some point in the past when you've been making a Web App or some kind of GUI, you've run it and made sure all the UI elements do what they're supposed to. Alternatively, maybe you've made a quick little command line script that lets you input values to be passed to a function, and then outputs the results. Those are both forms of testing!

The problem with testing your software manually like this is that as your application grows in complexity, it takes longer and longer to go through the steps, because it becomes more difficult to reach the desired functionality (e.g. more clicks of the UI). Automatically testing our code is much more efficient, and generally speaking the time it takes to run tests increases more linearly.

Unit Testing provides confidence that your code is working _before_ you deploy it - less bugs in production, yay! Tests can be run every time code is deployed, so if any breaking changes are made they will be detected. This means you can refactor or make additions more freely knowing that your functionality is not being compromised.

Why Unit Testing specifically? Why not just test our program as a whole and cover more code in a shorter amount of time? Well, the problem is that when you test multiple components as a black box, you have no way of telling what exact line(s) of code caused the bug.

### When to Unit Test

One of the biggest debates surrounding software testing is whether or not you should write your test _before_ or _after_ the actual code. Many people say you should write your tests for a class/module before you implement it. This is known as Test-Driven Development (TDD). Whether or not this is actually the case in practice is another story...

The main arguments for TDD are that it provides clarity and motivation for simplicity. By writing the tests for a unit before you implement it, you get to think about the requirements of your code so you get a better idea of how to write it because you understand what it should do. Additionally, you shouldn't theoretically add any unnecessary functionality because you're only writing the code so that it passes the tests - ergo, simplicity!

Sometimes requirements are liable to change and you can get a better understanding of the problem by going ahead and solving it. Hence, a lot of developers prefer to write tests after the code is written. The problem with this is that it can be hard to stay "on topic" and it's easy to write redundant code.
However, as new programmers / being new to a certain language or framework, it's quite infeasible to write our tests beforehand because we might not even understand how the code is going to work. This is precisely why we've waited until a later module of MSA phase 2 to show you how to do unit tests for an ASP.NET Core web API.

So without further ado, let's get underway!

## Writing Unit Tests for ScribrAPI

### Creating the Test Project

Have the ScribrAPI solution open in Visual Studio. Start by adding an MSTest project to it.

File -> New -> Project

Scroll down to MSTest Test Project (.Net Core), select it, then click "Next".

![Create New Project window - select MS Test Project and click Next](https://github.com/NZMSA/2019-Phase-2/blob/master/Unit%20Testing/images/CreateMSTestProject.png)

Give the project a name. Make sure to select "Add to solution" as shown in the image below, then click "Create".

![Project configuration - give it a name and click Create](https://github.com/NZMSA/2019-Phase-2/blob/master/Unit%20Testing/images/CreateMSTestProject2.png)

### Setting up the Test Project

Start by adding a reference from the newly created test project to the API project. Right-click on the unit test project in the solution explorer:

![Right-click on the unit test project](https://github.com/NZMSA/2019-Phase-2/blob/master/Unit%20Testing/images/ProjectInSolExplorer.png)

Then go Add -> Reference...

![Hover over Add, then click Reference](https://github.com/NZMSA/2019-Phase-2/blob/master/Unit%20Testing/images/AddReference.png)

In the Reference Manager window select the API project as show in the image below. Then select "Ok".

![Reference Manager Window - tick the ScribrAPI project and click Ok](https://github.com/NZMSA/2019-Phase-2/blob/master/Unit%20Testing/images/AddMainProjectReference.png)

Now we are going to add a couple of packages that will let us use a mock database (More on this in a bit).
Right-click on the project solution and select "Manage NuGet Packages for solution"
Add to the solution:

- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.InMemory

### Possible Error

```
Severity	Code	Description	Project	File	Line	Suppression State
Error	CS1705	Assembly 'ScribrAPI' with identity 'ScribrAPI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' uses 'Microsoft.AspNetCore.Mvc.Core, Version=2.2.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60' which has a higher version than referenced assembly 'Microsoft.AspNetCore.Mvc.Core' with identity 'Microsoft.AspNetCore.Mvc.Core, Version=2.0.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60'	UnitTestScribrAPI
```

If you get an error similar to the one above then do the following.

- Right click on the API project
- select "Unload"
- right click on the unloaded project and select edit \*.csproj

Ensure the following appears in the \*.csproj file

```xml
<PackageReference Include="Microsoft.AspNetCore.App" Version="2.2.0" />
```

Then reload the API project and select clean and rebuild.

### Let the Testing begin

Now we can start testing.

- Delete the default UnitTest.cs file
- Right-click on the test project
- select (add -> New Item)
- create a new .cs file. Let's call it TranscriptionsControllerUnitTests

The code we are interested in testing is the code inside our API controllers, as this is where the actual logic is done for serving data. We will start by testing TranscriptionsController because it's easier to test than VideosController - you'll see why later.

Copy the following snippet to the file. It has all the imports we will need. The attribute (a.k.a annotation) `[TestClass]` placed before the class tells MSTest that this class has methods that can be run as tests.

```csharp
using ScribrAPI.Controllers;
using ScribrAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace UnitTestScribrAPI
{
    [TestClass]
    public class TranscriptionsControllerUnitTests
    {
      // Insert code here
    }
}
```

We will begin by adding the following class variable to the top of the class:

```csharp
public static readonly DbContextOptions<scriberContext> options
= new DbContextOptionsBuilder<scriberContext>()
.UseInMemoryDatabase(databaseName: "testDatabase")
.Options;
```

What this does is create a configuration object that will allow us to create a scriberContext object that will access an in-memory database (i.e. something that uses an in-memory database to store the model of our API). As you'll see soon, context objects can be destroyed and reinitialized elsewhere and still access the same database. By mocking the database we greatly improve the speed at which the tests can run as they do not have to make a call to a real database.

Add in the following symbolic constant, which we will be used for populating the db:

```csharp
public static readonly IList<Transcription> transcriptions = new List<Transcription>
{
    new Transcription()
    {
        Phrase = "That's like calling"
    },
    new Transcription()
    {
        Phrase = "your peanut butter sandwich"
    }
};
```

Now we will define what happens before and after a test is run. We want to initialise the mock database before a test runs and then we want to clear the mock database after a test runs. This makes sure that all tests remain independent.

```csharp
[TestInitialize]
public void SetupDb()
{
    using (var context = new scriberContext(options))
    {
        // populate the db
        context.Transcription.Add(transcriptions[0]);
        context.Transcription.Add(transcriptions[1]);
        context.SaveChanges();
    }
}

[TestCleanup]
public void ClearDb()
{
    using (var context = new scriberContext(options))
    {
        // clear the db
        context.Transcription.RemoveRange(context.Transcription);
        context.SaveChanges();
    };
}
```

So, so far our whole skeleton test file looks like:

<details><summary>this (click to reveal)</summary>

```csharp
using ScribrAPI.Controllers;
using ScribrAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace UnitTestScribrAPI
{
    [TestClass]
    public class TranscriptionsControllerUnitTests
    {
        public static readonly DbContextOptions<scriberContext> options
        = new DbContextOptionsBuilder<scriberContext>()
        .UseInMemoryDatabase(databaseName: "testDatabase")
        .Options;

        public static readonly IList<Transcription> transcriptions = new List<Transcription>
        {
            new Transcription()
            {
                Phrase = "That's like calling"
            },
            new Transcription()
            {
                Phrase = "your peanut butter sandwich"
            }
        };

        [TestInitialize]
        public void SetupDb()
        {
            using (var context = new scriberContext(options))
            {
                // populate the db
                context.Transcription.Add(transcriptions[0]);
                context.Transcription.Add(transcriptions[1]);
                context.SaveChanges();
            }
        }

        [TestCleanup]
        public void ClearDb()
        {
            using (var context = new scriberContext(options))
            {
                // clear the db
                context.Transcription.RemoveRange(context.Transcription);
                context.SaveChanges();
            };
        }
    }
}
```

</details>

Now we can begin writing the test methods to test TranscriptionController. This is pretty trivial (TranscriptionController was scaffolded, i.e. auto-generated) so we just need to make sure all the CRUD operations work as we expect. In reality, because it was created automatically we don't _really_ need to unit test it, but here it is used for demonstration purposes.

```csharp
[TestMethod]
public async Task TestGetSuccessfully()
{
    using (var context = new scriberContext(options))
    {
        TranscriptionsController transcriptionsController = new TranscriptionsController(context);
        ActionResult<IEnumerable<Transcription>> result = await transcriptionsController.GetTranscription();

        Assert.IsNotNull(result);
        // i should really check to make sure the exact transcriptions are in there, but that requires an equality comparer,
        // which requires a whole nested class, thanks to C#'s lack of anonymous classes that implement interfaces
    }
}
```

```csharp
// unfortunately, it can be hard to avoid test method names that are also descriptive
[TestMethod]
public async Task TestPutMemeItemNoContentStatusCode()
{
    using (var context = new scriberContext(options))
    {
        string title = "this is now a different phrase";
        Transcription transcription1 = context.Transcription.Where(x => x.Phrase == transcriptions[0].Phrase).Single();
        transcription1.Phrase = title;

        TranscriptionsController transcriptionsController = new TranscriptionsController(context);
        IActionResult result = await transcriptionsController.PutTranscription(transcription1.TranscriptionId, transcription1) as IActionResult;

        Assert.IsNotNull(result);
        Assert.IsInstanceOfType(result, typeof(NoContentResult));
    }
}
```

There will be more tests in the project files
