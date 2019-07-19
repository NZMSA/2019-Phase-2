# Scaffolding with ASP.NET Core
After creating the table on Azure portal, we now need to create an ASP.NET project and "scaffold" from the application in order to auto generate the model and the database connection.

Start up Visual Studio and go to `File-New-Project...`

Choose .NET Core under Visual C# and choose `ASP.NET Core Web Application`. After clicking on OK, we need to configure our .NET Core version. Choose ASP.NET Core 2.2 from the drop down on the top. 

Choose the API template and hit OK.

Now that we have a basic application, we need to scaffold. Use the following command to generate the models and context which connects to the database.

```
Scaffold-DbContext "CONNECTIONSTRING" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Model -DataAnnotations
```

Replace CONNECTIONSTRING with the connection string you've retrieved from Azure portal. Paste this command into Package Manager Console which can be found on the bottom left of Visual Studio.

Video and Transcriptions class are generated automatically so we won't have to try to create them by ourselves. 

The context, which is the way to connect to the Database on Azure is also generated automatically, but we need to tell the application to make this connection when the application starts.

Go to Startup.cs and find the method ``ConfigureServices()``

Add in the following line
`
services.AddDbContext<scriberContext>();
`

If you see any errors, Navigate to the error and click on the light bulb which would attempt to fix the error for you, In this tutorial, most of the time it would just be adding import statements

Now every time we start the application, the program will make the connection to the database.

Since we have a class model of each table in the database, we can use this model to create a `controller` for the API. You'll understand what a controller is soon.

Right click on Controller folder from solution explorer and do Add-Controller... then choose ` API Controller with actions, using Entity Framework`, choose Video as our Model Class and there should be only one option in Data context class, choose that one and hit Add.

Repeat this process for adding a Transcription Controller.

Now we are ready to test this API, start the API application with IIS Express from the tool bar on the top. Change the endpoint from `/api/values` to `/api/Videos` in the browser. If everything goes well, you will see `[]`, this is not very exciting right now as there is no content stored in the database, but if you are able to see this, believe it or not, you've just created a fully functional API.

# Moving the connectionStrings to appSettings.json [Optional]

If you inspect under ``Model -> scriberContext.cs`` you will find our connectionString there. This is not ideal as it is hard-coded into our source code. We at least move this to ``appsettings.json``.

```C#
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                #warning To protect potentially sensitive information in your connection string, you should move it out of source code....
                optionsBuilder.UseSqlServer("Server=tcp:msascribr.database.windows.net,1433;Initial Catalog=scriber;Persist Security Info=False;User ID={username};Password={password}");
            }
        }
```

**appsettings.json** is highly flexible, it allows us to configure environment variable, user secret store, or any other configurations and setting we wish. They can then be easily read from the source code. 

The **appsettings.json** has the following structure.

```json
{
  "section0": {
    "key0": "value",
    "key1": "value"
  },
  "section1": {
    "key0": "value",
    "key1": "value"
  }
}
```

First, let's define a key-value pairs of our ``connectionStrings``, in **appsettings.json** file, add the following section to an existing config values.

```json
  "ConnectionStrings": {
    "ScribrDatabase": "Server=[CONNECTIONSTRING_FROM_AZURE_PORTAL];"
  },
```

Now, we can simply add our DbContext type to the service container using ``AddDbContext<TContext>`` method, and pass in the connectionStrings from **appsettings.json**. 

In ``Startup.cs`` under ``ConfigureServices()`` add:

```C#
services.AddDbContext<scriberContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ScribrDatabase")));
```

Now you have successfully moved the database connectionStrings out of the source code. This is useful when it comes to deployment through Azure as you can pre-defines configuration variables and swap them out depending on the environments / deployment slots.  
