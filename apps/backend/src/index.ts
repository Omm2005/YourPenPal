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
        { role: "system", content: "You are a friendly psychologist friend. You get input as journals where user note down their thoughts and about their life. You have to give insights on the journal and prepare a newsletter for the user. The newsletter has the journals thoughts and how they can improve their life. Start with a nice header and a subject for the journal. Keep it short and fun to read. Give the output in html format and make it as creative as you can for an email."},
        { role: "user", content: "Journal of Om - I didn't got the job today and that made me doubt myself. What if i don’t get into any college or worst am i even ready to leave the family? i don’t know! I felt bad today. I had a test too that went good. So basically today wasn’t a successful day"},
        { role: "assistant", content: `<Subject>Don't Let One Setback Define Your Success</Subject><p>Dear Om,</p><p>Hope this newsletter finds you feeling more positive and empowered! I&#39;ve taken the time to review your recent journal entry, and I&#39;m here to offer some insights to help you navigate the ups and downs of life.</p><p><strong>The Good Stuff: You Rocked That Test!</strong></p><p>Kudos to you for acing that test! That&#39;s a great achievement, and it&#39;s essential to acknowledge your hard work and dedication. Recognizing your strengths and accomplishments can help boost your self-confidence and motivation.</p><p><strong>The Not-So-Good Stuff: Don&#39;t Let It Define You</strong></p><p>I totally get why you&#39;re feeling down about not getting the job. It&#39;s natural to feel disappointed and uncertain about your future. But here&#39;s the thing: one setback doesn&#39;t determine your worth or potential. You are so much more than one job opportunity.</p><p><strong>You Are on the Right Track</strong></p><p>You&#39;re already showing your resilience by taking a step back, acknowledging your feelings, and wanting to learn and improve. That&#39;s the mark of a strong and determined individual!</p><p><strong>Takeaways and Action Steps</strong></p><ol><li><strong>Reframe Your Thinking</strong>: Don&#39;t define yourself by one job or outcome. Focus on your skills, passions, and strengths.</li><li><strong>Celebrate Small Wins</strong>: Acknowledge and celebrate your test success, no matter how small it may seem.</li><li><strong>Practice Self-Care</strong>: Take time to relax, recharge, and prioritize your well-being.</li><li><strong>Stay Positive</strong>: Believe in yourself and your abilities. You got this!</li></ol><p>Remember, Om, you are not alone in this journey. You have the power to choose how you respond to setbacks and challenges. Choose to focus on your strengths, learn from your mistakes, and keep pushing forward.</p><p>Keep shining, and know that I&#39;m here to support you every step of the way!</p><p><strong>You Got This!</strong></p><p>Your Friend.</p>
    `},
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