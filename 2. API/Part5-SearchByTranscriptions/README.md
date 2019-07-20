## SearchByTranscriptions

Let's finally implement another really exciting GET method. The SearchByTranscriptions! This will finally gives us the ability to search using keywords and return a list of **all** the videos containing those words!

Let's declare a basic GET method that will retrieve all the video and its phrases. Here, we use LINQ ``.Include()`` on **video.transcription** to utilize relationship between the video and transcription table. But this has an issue!
```C#
        // GET api/Videos/SearchByTranscriptions/HelloWorld
        [HttpGet("SearchByTranscriptions/{searchString}")]
        public async Task<ActionResult<IEnumerable<Video>>> Search(string searchString)
        {
            var videos = await _context.Video.Include(video => video.Transcription).ToListAsync();
            return Ok(videos);
        }
```

The self-referencing loop issue, caused by the two tables relationship, since when used ``include()``, each video now contains all its related transcription, however each transcription object also contains its video!

We need to add this particular option to ``ConfigureServices()`` method in ``Startup.cs``:

```C#
services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(
options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
```
Now that this issue is resolved, go ahead and test this **GET** method in swagger UI.

We can see that this essentially gives us back the list of video with each one containing its set of transriptions, but not quite filter to include only the transcription we want. 

The solution to this would be to extend the query further by using ``.Select()`` and on each video, only add transcriptions from Transription table if they contain our ``searchString``. Lastly convert it to a list using ``.ToListAsync()``.

```C#
        [HttpGet("SearchByTranscriptions/{searchString}")]
        public async Task<ActionResult<IEnumerable<Video>>> Search(string searchString)
        {
            // Choose transcriptions that has the phrase 
            var videos = await _context.Video.Include(video => video.Transcription).Select(video => new Video {
                VideoId = video.VideoId,
                VideoTitle = video.VideoTitle,
                VideoLength = video.VideoLength,
                WebUrl = video.WebUrl,
                ThumbnailUrl = video.ThumbnailUrl,
                IsFavourite = video.IsFavourite,
                Transcription = video.Transcription.Where(tran => tran.Phrase.Contains(searchString)).ToList()
            }).ToListAsync();

            return Ok(videos);
        }
```

Test out the implementation in Swagger. You will notice that we get the result we wanted, each transcription contains the phrase from the ``searchString``! However, since we select all the videos there maybe those ones without any transcription with matching ``searchString``, hence have empty transcription field. No worries, we can simply remove them from our list.


```C#
        // GET api/Videos/SearchByTranscriptions/HelloWorld
        [HttpGet("SearchByTranscriptions/{searchString}")]
        public async Task<ActionResult<IEnumerable<Video>>> Search(string searchString)
        {
            // Choose transcriptions that has the phrase 
            var videos = await _context.Video.Include(video => video.Transcription).Select(video => new Video {
                VideoId = video.VideoId,
                VideoTitle = video.VideoTitle,
                VideoLength = video.VideoLength,
                WebUrl = video.WebUrl,
                ThumbnailUrl = video.ThumbnailUrl,
                IsFavourite = video.IsFavourite,
                Transcription = video.Transcription.Where(tran => tran.Phrase.Contains(searchString)).ToList()
            }).ToListAsync();

            // Removes all videos with empty transcription
            videos.RemoveAll(video => video.Transcription.Count == 0);
            return Ok(videos);
        }
```

Adding the final touch we can restrict the user not to call the API without entering anything by not allowing ``searchString`` to be empty. 

```C#
        // GET api/Videos/SearchByTranscriptions/HelloWorld
        [HttpGet("SearchByTranscriptions/{searchString}")]
        public async Task<ActionResult<IEnumerable<Video>>> Search(string searchString)
        {
            if (String.IsNullOrEmpty(searchString))
            {
                return BadRequest("Search string cannot be null or empty.");
            }

            // Choose transcriptions that has the phrase 
            var videos = await _context.Video.Include(video => video.Transcription).Select(video => new Video {
                VideoId = video.VideoId,
                VideoTitle = video.VideoTitle,
                VideoLength = video.VideoLength,
                WebUrl = video.WebUrl,
                ThumbnailUrl = video.ThumbnailUrl,
                IsFavourite = video.IsFavourite,
                Transcription = video.Transcription.Where(tran => tran.Phrase.Contains(searchString)).ToList()
            }).ToListAsync();

            // Removes all videos with empty transcription
            videos.RemoveAll(video => video.Transcription.Count == 0);
            return Ok(videos);
        }
```

And that's it we have our **SearchByTranscriptions** done!
