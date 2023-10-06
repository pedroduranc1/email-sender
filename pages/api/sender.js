import Cors from "cors";
import { Resend } from "resend";
import logo from "../../public/logoNuevo.png";

const resend = new Resend("re_RA8ExANP_MpSpcwe5xessyisE1bE3DPpQ");

// Configura tus opciones de CORS
const cors = Cors({
  origin: "*", // Permitir solo este origen
  methods: ["GET", "POST"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function handler(req, res) {
  // Aplica el middleware CORS
  await runMiddleware(req, res, cors);

  const { to, title, author, url, type } = req.body;
  const recipients = to
    .split(",")
    .map((email) => email.trim()) // remover espacios
    .filter((email) => email);

  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px; color: #333;">

<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

    <div style="padding: 20px;">
        <img src="https://www.easysat.com.mx/assets/logoNuevo-3c1c33c6.png" alt="Logo de la empresa" style="max-width: 150px; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Hola EasySATER</h1>
        <p style="margin-bottom: 20px;">Tenemos un nuevo ${type} de parte de: <strong style="color: #2C3E50;">${author}</strong></p>
        <p style="font-size: 18px; font-weight: bold; margin-bottom: 25px;">Titulo del ${type}: ${title}</p>
        
        <a href="${url}" target="_blank" style="display: inline-block; margin-bottom: 25px; padding: 10px 20px; background-color: #3498DB; color: #ffffff; text-decoration: none; border-radius: 5px;">Ver ${type} →</a>
        
        <p style="margin-bottom: 20px;">Gracias por ser parte de EasySAT,<br>EasySat Team</p>
        
        <p style="margin-bottom: 10px;">Powered by Maizzle</p>
        <p style="font-size: 14px;">Quickly build HTML emails with Tailwind CSS</p>
        
        <div style="margin-top: 20px; font-size: 14px;">
            <a href="#" style="color: #3498DB; text-decoration: none; margin-right: 10px;">Docs</a>
            <a href="#" style="color: #3498DB; text-decoration: none; margin-right: 10px;">Github</a>
            <a href="#" style="color: #3498DB; text-decoration: none;">Twitter</a>
        </div>
    </div>

</div>

</body>
</html>

    `;

  // Aquí va el resto de tu código para el handler...
  try {
    await resend.emails.send({
      to: recipients,
      from: "info@easysat.com.mx",
      title: "Kavii - EasySat",
      subject: `Nuevo ${type} Disponbile en EasySat`,
      html,
    });

    return res.status(200).send("Enviado");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export default handler;
