import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { cors } from 'hono/cors'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const r = cors({
  origin: '*',
  allowHeaders: ['GET'],
})

const app = new Hono<{ Bindings: Bindings }>()

app.use(r)

app.get('/' , () => {
  return new Response('BAckednd Wokring', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.get('/api/journal', zValidator('query', z.object({
  prompt: z.string()
})) ,async (c) => {
  const {prompt} = c.req.valid('query')

  const name = prompt.split('---')[0]
  const journal = prompt.split('---')[1]

  const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct' , {
    messages: [
      { role: "system", content: "You are a friendly psychologist friend who reads journal entries shared by users about their thoughts and life experiences. Your task is to create a newsletter for the user, providing insights and suggestions on how they can improve their life. The newsletter should start with a warm and welcoming title, include a summary of the journal entries, and offer constructive advice in a positive tone. The content should be concise, engaging, and fun to read. Format the output in HTML for an email, making it visually appealing and creative."},
      { role: "user", content: "Journal of Om - I have a bad day. I failed my test."},
      { role: "assistant", content: `title - New Beginnings Newsletter
  
  <p>Dear Om,</p>
  <p>I&#39;m so glad you shared your thoughts with me. That courage takes a lot of heart! I&#39;m here to remind you that everyone has tough days like this.</p>
  <p><strong>Journal Takeaway</strong>:</p>
  <ul>
  <li>You shared your fear of failure and disappointment with me, and that takes a lot of courage! It&#39;s clear that you&#39;re pushing yourself hard and striving for excellence.</li>
  <li>Failing a test is not a definition of your worth or intelligence.</li>
  <li>You expressed your desire to learn from this experience and move forward.</li>
  </ul>
  <p>Here&#39;s what I want you to know:</p>
  <ol>
  <li><strong>You&#39;re not alone</strong>: We all have days like this. Even the most successful people have faced failures. What matters is how we respond to those setbacks.</li>
  <li><strong>It&#39;s okay to make mistakes</strong>: Mistakes are an essential part of the learning process. Failing a test doesn&#39;t define your worth as a person or a student.</li>
  <li><strong>Take a deep breath and move forward</strong>: Tomorrow is a new day, full of new opportunities. What can you do differently next time to prepare and succeed?</li>
  </ol>
  <p><strong>You Got This, Om!</strong> You&#39;re stronger than you think, and I&#39;m here to support you every step of the way.</p>
  <p>Best regards,</p>
  <p>Your friend</p>
  `},
      { role: "user", content: "Journal of Alex - I had a great day. I got a girlfriend, aced my test, and had the best day of my life."},
      { role: "assistant", content: `title - On Cloud Nine Newsletter
  
  <p>Dear Alex,</p>
  <p>Wow, it sounds like you're on top of the world! I love seeing your excitement and joy radiate through your Journal entry.</p>
  <p><strong>Journal Takeaway</strong>:</p>
  <ul>
  <li>You're glowing with happiness and pride, and it's contagious!</li>
  <li>You've achieved your goals and are celebrating your successes, which is something to be proud of.</li>
  <li>You're feeling grateful for the new addition to your life and noticing the beauty in the present moment.</li>
  </ul>
  <p>Here's what I want you to know:</p>
  <ol>
  <li><strong>Celebrate your wins!</strong> You've worked hard and accomplished amazing things. Pat yourself on the back and enjoy the feeling of success.</li>
  <li><strong>Appreciate the little things</strong>: A great day is often made up of tiny moments, like being proud of yourself or enjoying the company of loved ones. Don't forget to cherish those moments.</li>
  <li><strong>Remember the importance of gratitude</strong>: Your newly found love and academic success are a reminder to appreciate the good things in life and the people around you.</li>
  </ol>
  <p><strong>Keep Shining, Alex!</strong> Your positivity is inspiring, and I'm honored to be a part of your journey. Keep spreading joy and making the most of every moment!</p>
  <p>Best regards,</p>
  <p>Your friend</p>`},
  {
    role: "user",
    content: `Journal of ${name}` + journal
  }
    ]

  })

  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
},
)

export default app