'use server'

import { getServerAuthSession } from "./auth"
import { db } from "./db"
import { journals } from "./db/schema"
import { desc, eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import Showdown from "showdown";

export const addJournalEntry = async (body: string) => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    await db.insert(journals).values({
        body,
        userId: user.id,
        createdAt: new Date()
    }).execute()

    return ({ success: true })
}

export const aiResponse = async (journal: string) => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    try {

        const journalId = await db.select({
            id: journals.id
        })
        .from(journals)
        .where(eq(journals.body, journal))
        .execute()

      const finalJournal = `Journal of ${user.name} - ${journal}`
    //   
      const response = await fetch(`${process.env.AI_URL}/api/journal?prompt=` + finalJournal)
      const data: { response: string } = await response.json()
      const res = await data.response
      const subject = res.split('title - ')[1]?.split('<p>')[0] || 'Insights on your journal'
      const aiResponse = res.split(subject!)[1]! || res

      await updateJournalEntry(journalId[0]!.id, aiResponse, subject!)

      await sendEmail(subject!, aiResponse)

      return ({ success: true })
    } catch (error) {
        return ({ success: false, error: error })
    } 
}

export const updateJournalEntry = async (id: string, aiResponse: string, title: string) => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    try {
        await db.update(journals)
        .set({ aiResponse, title })
        .where(eq(journals.id, id))
        .execute()

        return ({ success: true })
    } catch (error) {
        return ({ success: false, error: error })
    }
}

export const deleteJournalEntry = async (id: string) => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    await db.delete(journals)
    .where(eq(journals.id, id))
    .execute()

    return ({ success: true })
}

export const getAllJournalEntries = async () => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    const entries = await db.select({
        id: journals.id,
        body: journals.body,
        createdAt: journals.createdAt,
    })
    .from(journals)
    .where(eq(journals.userId, user.id))
    .orderBy(desc(journals.createdAt))
    .execute()

    return ({ success: true, entries })
}

export const getJournalEntryFromID = async (id: string) => {
    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    const entry = await db.select({
        id: journals.id,
        body: journals.body,
        createdAt: journals.createdAt,
    })
    .from(journals)
    .where(eq(journals.id, id))
    .execute()

    return ({ success: true, entry })
}

export const sendEmail = async (Subject: string, html: string) => {

    const session = await getServerAuthSession()
    const user = session?.user

    if(!user) {
        return ({ success: false, error: "User not found" })
    }

    const converter = new Showdown.Converter();
const body = converter.makeHtml(html);

    try {

        const trasnporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.Email!,
                pass: process.env.EmailPass!
            }
        });
        
        const mailOptions = {
            from: process.env.Email!,
            to: user.email!,
            subject: Subject,
            html: body
        }
        
        await trasnporter.sendMail(mailOptions)
        return ({ success: true })
    } catch (error) {
        return ({ success: false, error: error })
    }
}