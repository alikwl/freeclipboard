import { supabase } from './supabase';

export interface AIAction {
  action: 'summarize' | 'rephrase' | 'translate' | 'clean';
  language?: string;
}

export async function processWithAI(content: string, aiAction: AIAction): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-helpers', {
    body: {
      content,
      action: aiAction.action,
      language: aiAction.language,
    },
  });

  if (error) {
    throw new Error(error.message || 'AI processing failed');
  }

  return data.result;
}

export async function generateQRCode(url: string): Promise<string> {
  const QRCode = await import('qrcode');
  
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}