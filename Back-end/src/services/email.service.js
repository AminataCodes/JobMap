import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token, role) => {
    const link = `${process.env.CLIENT_URL}/verify-email?token=${token}&role=${role}`

    await resend.emails.send({
        //  Pendant les tests, Resend autorise uniquement onboarding@resend.dev
        // En prod, remplace par un domaine vérifié : noreply@tondomaine.com
        from: 'JobMap <onboarding@resend.dev>',
        to: email,
        subject: 'Vérifie ton adresse email — JobMap',
        html: `
            <h2>Bienvenue sur JobMap !</h2>
            <p>Clique sur le lien ci-dessous pour vérifier ton email :</p>
            <a href="${link}" style="padding:12px 24px;background:#4F46E5;color:white;border-radius:6px;text-decoration:none">
                Vérifier mon email
            </a>
            <p style="color:#888;font-size:12px">Ce lien expire dans 24h.</p>
        `,
    })
}

export const sendRendezVousEmail = async ({
  to,
  prenomEtudiant,
  nomPoste,
  nomEntreprise,
  dateProposee,
  lieu,
  lienVisio,
  message,
  rdvId
}) => {
  const dateFormatee = new Date(dateProposee).toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  })

  const detailLieu = lieu
    ? `<p><strong>Lieu :</strong> ${lieu}</p>`
    : lienVisio
    ? `<p><strong>Lien visio :</strong> <a href="${lienVisio}">${lienVisio}</a></p>`
    : ''

  await resend.emails.send({
    from: 'JobMap <onboarding@resend.dev>',
    to,
    subject: `Entretien proposé — ${nomPoste} chez ${nomEntreprise}`,
    html: `
      <h2>Bonjour ${prenomEtudiant},</h2>
      <p><strong>${nomEntreprise}</strong> vous a proposé un entretien pour le poste de <strong>${nomPoste}</strong>.</p>
      <p><strong>Date :</strong> ${dateFormatee}</p>
      ${detailLieu}
      ${message ? `<p><strong>Message :</strong> ${message}</p>` : ''}
      <p>Connectez-vous sur JobMap pour accepter ou refuser ce rendez-vous.</p>
    `
  })
}