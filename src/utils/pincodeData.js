export const indianStatesAndUTs = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const pincodeDirectory = {
  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', region: 'North', speed: 'Same-Day Delivery by 9 PM', cod: true, serviceable: true, etaDays: 0 },
  '110020': { city: 'Okhla, New Delhi', state: 'Delhi', region: 'North', speed: 'Tomorrow, by 11 AM', cod: true, serviceable: true, etaDays: 1 },
  '122001': { city: 'Gurugram', state: 'Haryana', region: 'North', speed: 'Tomorrow, by 12 PM', cod: true, serviceable: true, etaDays: 1 },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', region: 'North', speed: 'Tomorrow, by 1 PM', cod: true, serviceable: true, etaDays: 1 },

  // Maharashtra
  '400001': { city: 'Fort, Mumbai', state: 'Maharashtra', region: 'West', speed: 'Same-Day Delivery by 8 PM', cod: true, serviceable: true, etaDays: 0 },
  '400050': { city: 'Bandra West, Mumbai', state: 'Maharashtra', region: 'West', speed: 'Tomorrow, by 11 AM', cod: true, serviceable: true, etaDays: 1 },
  '411001': { city: 'Pune City', state: 'Maharashtra', region: 'West', speed: 'Tomorrow, by 4 PM', cod: true, serviceable: true, etaDays: 1 },
  '440001': { city: 'Nagpur', state: 'Maharashtra', region: 'West', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },

  // Karnataka
  '560001': { city: 'MG Road, Bengaluru', state: 'Karnataka', region: 'South', speed: 'Same-Day Delivery by 7 PM', cod: true, serviceable: true, etaDays: 0 },
  '560103': { city: 'Bellandur / Outer Ring Rd, Bengaluru', state: 'Karnataka', region: 'South', speed: 'Tomorrow, by 10 AM', cod: true, serviceable: true, etaDays: 1 },
  '570001': { city: 'Mysuru', state: 'Karnataka', region: 'South', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },

  // Telangana & Andhra Pradesh
  '500001': { city: 'Abids / Koti, Hyderabad', state: 'Telangana', region: 'South', speed: 'Tomorrow, by 11 AM', cod: true, serviceable: true, etaDays: 1 },
  '500081': { city: 'HITEC City, Hyderabad', state: 'Telangana', region: 'South', speed: 'Tomorrow, by 10 AM', cod: true, serviceable: true, etaDays: 1 },
  '530001': { city: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South', speed: '2-3 Days Delivery', cod: true, serviceable: true, etaDays: 2 },

  // Tamil Nadu
  '600001': { city: 'George Town, Chennai', state: 'Tamil Nadu', region: 'South', speed: 'Tomorrow, by 2 PM', cod: true, serviceable: true, etaDays: 1 },
  '600028': { city: 'R.A. Puram, Chennai', state: 'Tamil Nadu', region: 'South', speed: 'Tomorrow, by 12 PM', cod: true, serviceable: true, etaDays: 1 },
  '641001': { city: 'Coimbatore', state: 'Tamil Nadu', region: 'South', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },

  // West Bengal & East
  '700001': { city: 'BBD Bagh, Kolkata', state: 'West Bengal', region: 'East', speed: 'Tomorrow, by 3 PM', cod: true, serviceable: true, etaDays: 1 },
  '700091': { city: 'Salt Lake Sector V, Kolkata', state: 'West Bengal', region: 'East', speed: 'Tomorrow, by 1 PM', cod: true, serviceable: true, etaDays: 1 },
  '751001': { city: 'Bhubaneswar', state: 'Odisha', region: 'East', speed: '2-3 Days Delivery', cod: true, serviceable: true, etaDays: 3 },
  '781001': { city: 'Guwahati', state: 'Assam', region: 'North-East', speed: '3-4 Days Delivery', cod: true, serviceable: true, etaDays: 3 },

  // Gujarat
  '380001': { city: 'Ahmedabad Central', state: 'Gujarat', region: 'West', speed: 'Tomorrow, by 4 PM', cod: true, serviceable: true, etaDays: 1 },
  '395001': { city: 'Surat', state: 'Gujarat', region: 'West', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },

  // Rajasthan & North
  '302001': { city: 'Jaipur', state: 'Rajasthan', region: 'North', speed: 'Tomorrow, by 5 PM', cod: true, serviceable: true, etaDays: 1 },
  '160017': { city: 'Sector 17, Chandigarh', state: 'Chandigarh', region: 'North', speed: 'Tomorrow, by 1 PM', cod: true, serviceable: true, etaDays: 1 },
  '141001': { city: 'Ludhiana', state: 'Punjab', region: 'North', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },
  '226001': { city: 'Hazratganj, Lucknow', state: 'Uttar Pradesh', region: 'North', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 },
  '800001': { city: 'Patna', state: 'Bihar', region: 'East', speed: '2-3 Days Delivery', cod: true, serviceable: true, etaDays: 3 },
  '682001': { city: 'Kochi', state: 'Kerala', region: 'South', speed: '2 Days Delivery', cod: true, serviceable: true, etaDays: 2 }
};

/**
 * Check Indian pincode serviceability and derive state & city
 */
export const checkPincodeServiceability = (pincode) => {
  const pin = String(pincode).trim();
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return {
      isValid: false,
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian PIN code'
    };
  }

  // Exact match from directory
  if (pincodeDirectory[pin]) {
    const data = pincodeDirectory[pin];
    return {
      isValid: true,
      serviceable: true,
      pincode: pin,
      city: data.city,
      state: data.state,
      speed: data.speed,
      etaDays: data.etaDays,
      codAvailable: data.cod,
      message: `⚡ Express Delivery available for ${data.city}, ${data.state} (${data.speed})`
    };
  }

  // First digit zone estimation for all other Indian pincodes
  const firstDigit = pin[0];
  let estimatedState = 'Delhi';
  let estimatedRegion = 'North';

  switch (firstDigit) {
    case '1':
      estimatedState = 'Delhi';
      estimatedRegion = 'North (Delhi, Haryana, Punjab, HP, J&K)';
      break;
    case '2':
      estimatedState = 'Uttar Pradesh';
      estimatedRegion = 'North (UP, Uttarakhand)';
      break;
    case '3':
      estimatedState = 'Rajasthan';
      estimatedRegion = 'West (Rajasthan, Gujarat)';
      break;
    case '4':
      estimatedState = 'Maharashtra';
      estimatedRegion = 'West (Maharashtra, MP, Goa, Chhattisgarh)';
      break;
    case '5':
      estimatedState = 'Karnataka';
      estimatedRegion = 'South (Andhra, Telangana, Karnataka)';
      break;
    case '6':
      estimatedState = 'Tamil Nadu';
      estimatedRegion = 'South (Tamil Nadu, Kerala, Lakshadweep)';
      break;
    case '7':
      estimatedState = 'West Bengal';
      estimatedRegion = 'East (West Bengal, Odisha, North-East)';
      break;
    case '8':
      estimatedState = 'Bihar';
      estimatedRegion = 'East (Bihar, Jharkhand)';
      break;
    default:
      estimatedState = 'India';
      estimatedRegion = 'India';
  }

  return {
    isValid: true,
    serviceable: true,
    pincode: pin,
    city: `Standard Delivery Zone`,
    state: estimatedState,
    speed: 'Delivery in 3-4 Business Days',
    etaDays: 3,
    codAvailable: true,
    message: `Delivery available in 3-4 Business Days to ${estimatedRegion}. Cash on Delivery eligible.`
  };
};
