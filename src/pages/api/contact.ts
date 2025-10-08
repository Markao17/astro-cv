import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json()
		const { name, email, company, subject, message } = body

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return new Response(
				JSON.stringify({
					error: 'Missing required fields. Please fill out all required fields.'
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({
					error: 'Invalid email address.'
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		}

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: 'Portfolio Contact <contact@mperalta.com>', // This will be your verified domain
			to: ['marko.jp.17@gmail.com', 'contact@mperalta.com'],
			replyTo: email,
			subject: `Portfolio Contact: ${subject}`,
			html: `
				<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
						New Contact Form Submission
					</h2>
					
					<div style="margin: 20px 0;">
						<p style="margin: 10px 0;">
							<strong>From:</strong> ${name}
						</p>
						<p style="margin: 10px 0;">
							<strong>Email:</strong> 
							<a href="mailto:${email}" style="color: #0066cc;">${email}</a>
						</p>
						${
							company
								? `<p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>`
								: ''
						}
						<p style="margin: 10px 0;">
							<strong>Subject:</strong> ${subject}
						</p>
					</div>
					
					<div style="background: #f5f5f5; border-left: 4px solid #333; padding: 15px; margin: 20px 0;">
						<strong>Message:</strong>
						<p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
					</div>
					
					<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
						<p>This email was sent from your portfolio contact form.</p>
					</div>
				</div>
			`
		})

		if (error) {
			console.error('Resend error:', error)
			return new Response(
				JSON.stringify({
					error: 'Failed to send email. Please try again or contact me directly.'
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		}

		return new Response(
			JSON.stringify({
				message: 'Message sent successfully! I will get back to you soon.',
				data
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
	} catch (error) {
		console.error('Error processing contact form:', error)
		return new Response(
			JSON.stringify({
				error: 'An unexpected error occurred. Please try again.'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
	}
}

