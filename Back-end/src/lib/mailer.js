
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token, role) => {
    const link = `${process.env.CLIENT_URL}/verify-email?token=${token}&role=${role}`

    await resend.emails.send({
        from: 'JobMap <noreply@tondomaine.com>',
        to: email,
        subject: 'Vérifie ton adresse email — JobMap',
        html: `
            <h2>Bienvenue sur JobMap !</h2>
            <p>Clique sur le lien ci-dessous pour vérifier ton email :</p>
            <a href="${link}">Vérifier mon email</a>
            <p>Ce lien expire dans 24h.</p>
        `
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
    from: 'JobMap <noreply@tondomaine.com>',
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