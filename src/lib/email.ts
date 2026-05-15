import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const resend = getResend();
  if (!resend) {
    console.log("[Email] No RESEND_API_KEY configured. Would send:", { to, subject });
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Burgos & Asociados <notificaciones@burgos.com.ar>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Email] Error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Email] Exception:", err);
    return { success: false, error: err };
  }
}

// Templates
export function emailTurnoConfirmado(nombre: string, fecha: string, hora: string, abogado: string) {
  return `
    <div style="font-family: system-ui; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c9a84c;">Burgos & Asociados</h2>
      <p>Hola ${nombre},</p>
      <p>Tu turno ha sido <strong>confirmado</strong>:</p>
      <div style="background: #f5f5f7; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Fecha:</strong> ${fecha}</p>
        <p style="margin: 4px 0;"><strong>Hora:</strong> ${hora}</p>
        <p style="margin: 4px 0;"><strong>Profesional:</strong> ${abogado}</p>
      </div>
      <p>Te esperamos en Av. Corrientes 1234, Piso 8, CABA.</p>
      <p style="color: #888; font-size: 12px;">Burgos & Asociados — Estudio Jurídico</p>
    </div>
  `;
}

export function emailNuevoContacto(nombre: string, email: string, area: string, mensaje: string) {
  return `
    <div style="font-family: system-ui; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c9a84c;">Nueva consulta recibida</h2>
      <div style="background: #f5f5f7; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Nombre:</strong> ${nombre}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0;"><strong>Área:</strong> ${area}</p>
        <p style="margin: 4px 0;"><strong>Mensaje:</strong> ${mensaje}</p>
      </div>
      <p style="color: #888; font-size: 12px;">Derivar al abogado correspondiente.</p>
    </div>
  `;
}

export function emailAudienciaProxima(abogado: string, tipo: string, fecha: string, juzgado: string) {
  return `
    <div style="font-family: system-ui; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c9a84c;">⚠️ Audiencia próxima</h2>
      <p>Hola ${abogado},</p>
      <p>Tenés una audiencia en los próximos días:</p>
      <div style="background: #f5f5f7; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Tipo:</strong> ${tipo}</p>
        <p style="margin: 4px 0;"><strong>Fecha:</strong> ${fecha}</p>
        <p style="margin: 4px 0;"><strong>Juzgado:</strong> ${juzgado}</p>
      </div>
      <p style="color: #888; font-size: 12px;">Burgos & Asociados — ERP</p>
    </div>
  `;
}

export function emailTareaVencimiento(abogado: string, titulo: string, vence: string) {
  return `
    <div style="font-family: system-ui; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c9a84c;">⏰ Tarea por vencer</h2>
      <p>Hola ${abogado},</p>
      <p>La siguiente tarea está por vencer:</p>
      <div style="background: #f5f5f7; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Tarea:</strong> ${titulo}</p>
        <p style="margin: 4px 0;"><strong>Vence:</strong> ${vence}</p>
      </div>
      <p style="color: #888; font-size: 12px;">Burgos & Asociados — ERP</p>
    </div>
  `;
}
