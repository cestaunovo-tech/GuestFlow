import QRCode from 'qrcode';

export interface RoomQRData {
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  floor: number;
  building: string;
  url: string;
}

export const generateRoomUrl = (hotelId: string, roomNumber: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://guestflow.hotel';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return `${origin}${pathname}?view=guest&hotel=${encodeURIComponent(hotelId)}&room=${encodeURIComponent(roomNumber)}`;
};

export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0c2d3e', // GuestFlow dark brand teal
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
};

export const generateQrCodeDataUrl = async (hotelId: string, roomNumber: string): Promise<string> => {
  const url = generateRoomUrl(hotelId, roomNumber);
  return generateQRCodeDataUrl(url);
};

export const generateQRCodeSvg = async (text: string): Promise<string> => {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0c2d3e',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating SVG QR code:', err);
    return '';
  }
};
