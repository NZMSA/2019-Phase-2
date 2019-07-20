using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScribrAPI.Model;

namespace ScribrAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranscriptionsController : ControllerBase
    {
        private readonly scriberContext _context;

        public TranscriptionsController(scriberContext context)
        {
            _context = context;
        }

        // GET: api/Transcriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transcription>>> GetTranscription()
        {
            return await _context.Transcription.ToListAsync();
        }

        // GET: api/Transcriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transcription>> GetTranscription(int id)
        {
            var transcription = await _context.Transcription.FindAsync(id);

            if (transcription == null)
            {
                return NotFound();
            }

            return transcription;
        }

        // PUT: api/Transcriptions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTranscription(int id, Transcription transcription)
        {
            if (id != transcription.TranscriptionId)
            {
                return BadRequest();
            }

            _context.Entry(transcription).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TranscriptionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Transcriptions
        [HttpPost]
        public async Task<ActionResult<Transcription>> PostTranscription(Transcription transcription)
        {
            _context.Transcription.Add(transcription);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTranscription", new { id = transcription.TranscriptionId }, transcription);
        }

        // DELETE: api/Transcriptions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Transcription>> DeleteTranscription(int id)
        {
            var transcription = await _context.Transcription.FindAsync(id);
            if (transcription == null)
            {
                return NotFound();
            }

            _context.Transcription.Remove(transcription);
            await _context.SaveChangesAsync();

            return transcription;
        }

        private bool TranscriptionExists(int id)
        {
            return _context.Transcription.Any(e => e.TranscriptionId == id);
        }
    }
}
