# Phase 2 API and Frontend on DevOps

For this module we will be placing our existing <i>Scribr</i> React Application and API into continuous development pipelines. This allows us to have various benefits:
* You don't need to upload code to Azure every time you make a commit
* Your code is automatically built on a virtual machine on Azure and deployed on your web app
* You can add tests that run before deploying your code to make sure that it is free of errors

But why would you want to deploy code using this method compared to just building on your laptop and uploading it to Azure?
* Your computer may have different environmental variables (Version numbers, etc..) compared to the VM on Azure which may make you assume that just because it worked on your computer, it would work when uploaded to azure. That's a wrong way of thinking as the abovementioned environment variables can cause the build to crash on Azure
* This pipeline makes sure that you do not publish broken builds to your Web App as the app is compiled and checked for compile errors before uploading to production
* It allows you to automatically detect and remove any passwords or confidential values before your website hits the production site (Not covered in this module)

Cool, now that we've covered why it is recommended to use a CI/CD environment in productions of projects, lets get started...


## Before you start
Make sure your github repo for the API looks like this. That is:

![](https://i.imgur.com/IwD0sej.png)

* Your ScribrAPI.sln file and ScribrAPI folder are on the root of the repo
    * All your context and controllers are in the ScribrAPI folder

Also, make sure you have: 
* Azure Account with Azure for Students subscription

# API on DevOps
If you've followed all previous tutorials properly, converting your project into a DevOps project should be super easy.

##### Step 1:
Get started by clicking "Create Resource" -> DevOps -> DevOps Project
![](https://i.imgur.com/hIBoRZB.png)

##### Step 2:
Once in the setup, you can start a project from fresh using the given templates (.NET, Node.js, PHP, etc..) but since we already have our coded previously and on Github, we are going to select the "Bring your own code" option
![](https://i.imgur.com/cKXoTKs.png)

##### Step 3:
Now you want to select the *Code Repository* as GitHub and go through the process of selecting your repo and branch (commonly the master branch unless you've made seperate branches)
![](https://i.imgur.com/bn3sKOp.png)
![](https://i.imgur.com/RO1h0ED.png)

##### Step 4:
Cool! Once you've done that, press next and you will get to the page that asks you to configure your framework. Since the API was coded in a .NET environment, we will choose the runtime as *.NET* and the application framework as *ASP.NET Core*
Warning! By default, the framework is selected as ASP.NET. Please be sure to choose ASP.NET Core
![](https://i.imgur.com/PSWp0oO.png)

##### Step 5:
Press next, and choose the Azure service as Windows Web App. This is becaue our project is an ASP.NET app and it does not make sense to run it on Linux as Windows is supported by default.
![](https://i.imgur.com/sZhPK9m.png)

##### Step 6:
Press next, and we're almost set up! We want to give our new devops project a name and organisation. If you dont have an organisation, create a new one.
Now under Pricing tier, press "Additional Settings" and select the F1 Free tier as shown in the illustration below.
![](https://i.imgur.com/XRsGHJX.png)

##### Step 7:
Perfect! Press next and wait for the deployment to be completed. This may take a while so stretch for a bit.
Once you're done, you'll see the page below and you want to select "Go to resource"
![](https://i.imgur.com/W40AKwS.png)

##### Step 8:
And that's pretty much it. If you've configured everything properly, you will see the follwing stages shown below where your code is compiled in the "Build" stage and then sent to dev to be released onto your web app. You can track the status of each of the tasks by clicking on the "in progress" links.
![](https://i.imgur.com/M4TZnPp.png)
![](https://i.imgur.com/TXOSRhx.png)

Once the build and release stages are complete, click on the link for your web app and hopefully your app shows up. Congratulations! At this stage, you've completed the steps to automate the build and release of your project every time you commit a change to github. No need to re-upload and re-compile... Isn't that cool!

## Testing

Hi guys! Marc here just for this one section. Azure DevOps is about to get even more magical! If you aren't doing Unit Testing, then don't worry about this (although, if you're using DevOps I highly recommend doing Unit Testing as they work really well together). All you need to do to setup automated testing before deployment is to put your test project in the same github repo as the the rest of the project, like so:

![](https://i.imgur.com/Mmo2zaM.png)

However, it turns out that I (somewhat embarrasingly) went against the usual convension for the name of test projects in the .NET realm, so we need to change the regex pattern that Azure DevOps uses to look for test projects.

Go to the overview of your DevOps project and click Pipelines -> Builds
![](https://i.imgur.com/HswShUc.png)

Above the build list, click edit to edit the pipeline
![](https://i.imgur.com/DSduSfg.png)

As you can see here, the pipeline is set to look for the pattern ```**/*UnitTests/*.csproj```
![](https://i.imgur.com/EMTcfWs.png)

We need this to match the Unit Test project, so change it to ``**/UnitTesting*/*.csproj``` Once you've done that, click Save & Queue. There will be another popup asking you to confirm the save.
![](https://i.imgur.com/1PKml8W.png)

You will be automatically taken to the summary of the build you just queued. Click on the Test job
![](https://i.imgur.com/3RfICPQ.png)

As you can see, the tests ran and were successful. Hurrah!
![](https://i.imgur.com/Pgzl1AH.png)

If any tests fail, the build will fail and will not be deployed - this is perfect because it automatically stops you from putting buggy code out into production. :)

# Front End on DevOps
Alright. Now that we've gotten aquainted with setting up a CI/CD pipeline for our API, the general steps to add the frontend to our DevOps cycle should be the same, aside from a few differences. 

## Before you start
Make sure your github repo for the Scribr React frontend looks like this. That is:

![](https://i.imgur.com/av93kRl.png)

##### Step 1:
Follow Steps 1-3 from the API deployment section...

##### Step 2:
Instead of selecting .NET as our environment, we are going to pick "Node.JS" This is because the React app that we have built runs on top of Typescript which is a superset of Javascript.

![](https://i.imgur.com/r59h1Lb.png)

##### Step 3:
Then we want to proceed to selecting the Azure service once again as Windows and then, under Additional features and this is very important - For the "Path to application code", you want to put "build/" and select Task runner as None

![](https://i.imgur.com/jKkUJJO.png)

##### Step 4:
Follow the image below and set up your fields as shown but (of course) make sure to change your application name and web app name. Ensure that you've selected the free tier as you don't want to get charged.

![](https://i.imgur.com/j2yADbU.png)

##### Step 5:
Now comes the waiting game. Complete the setup and wait for an initial release of the build to complete. It will fail in the final stage because in step 3, we specified our path to application code as "build/" but that folder does not yet exist. We need to ask npm to build the project first. Click on the Failed link and follow the images below to get to the stage where you modify a pipeline.

![](https://i.imgur.com/so3wD8a.png)
![](https://i.imgur.com/nIHWnMO.png)
![](https://i.imgur.com/B0oyBbe.png)
![](https://i.imgur.com/Ehcd3va.png)

This is your exposure to how you can add other nuggets of code to your pipeline to enhance your workflow. Feel free to have a look at what other commands do but do not add them to this project.

You want to search for the "npm" command and click on that

![](https://i.imgur.com/4ldaTQQ.png)

##### Step 6:
Modify the npm command as shown below. What we are doing here is basically asking the pipeline to run "npm run-script build" so it can generate static files for us to deploy. After doing that, dont press "Save and Queue" but press just "Save". We still have a little bit to do before we can run this pipeline. You can try queuing it if you're feeling curious and then come back to Step 7.

![](https://i.imgur.com/72sIM8h.png)

##### Step 7:
If you just tried to run the pipeline before this, you would have noticed that you get an Error 404 on the website after a successful deployment. This is because Azure adds a pre-templated web.config file to our web app that messes up the way react handles its rendering. To get around this, we will need to stop azure from adding the web.config file. Follow the images below to find the checkbox that generates the web.config file and disable it.

![](https://i.imgur.com/Ijopp9x.png)
![](https://i.imgur.com/abPJ1tg.png)
![](https://i.imgur.com/j6YRaY7.png)
![](https://i.imgur.com/pGB4jiI.png)

##### Step 8:
And thats about it. Go back and queue your "Pipeline" and sit back for a few minutes and watch your code get compiled and deployed right in front of your eyes - like magic! 
Now, whenever you commit a change to github, Azure DevOps will pick it up and run it through this pipeline and deploy it for production.

And thats it folks.. Thats the basics to getting started with DevOps. There's more powerful things that DevOps can do which you only discover by exploring. So look through the commands and experiment with what you can do. Happy MSA-ing!

