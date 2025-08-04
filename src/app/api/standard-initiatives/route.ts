
import { NextResponse } from 'next/server';

const initiatives = [
    {
      id: '1',
      shortName: 'Capacity building - technical and programmatic',
      description: 'Technical and programmatic capacity building of country offices and partners, including humanitarian response and preparedness',
    },
    {
      id: '2',
      shortName: 'Communications for specific thematic areas',
      description: 'Communication relating to specific thematic areas',
    },
    {
      id: '3',
      shortName: 'General communications and branding',
      description: 'General communications and branding, including web-site maintenance',
    },
    {
      id: '4',
      shortName: 'Humanitarian response and preparedness coordination',
      description: 'Humanitarian response and preparedness coordination',
    },
    {
      id: '5',
      shortName: 'Interagency collaboration and UN Reform',
      description: 'Interagency collaboration and implementation of the UN reform agenda',
    },
    {
      id: '6',
      shortName: 'Knowledge management',
      description: 'Generate, promote and disseminate knowledge',
    },
    {
      id: '7',
      shortName: 'Office management and operations',
      description: 'Prorated general office management and operations costs; applies to both programme and management/development effectiveness activities',
    },
    {
      id: '8',
      shortName: 'Operations and security support',
      description: 'Financial, budget, HR, IT, procurement, logistics, security etc. advisory support and capacity building of country offices; includes training workshops and missions',
    },
    {
      id: '9',
      shortName: 'Partnerships - general',
      description: 'Build and expand various kinds of programmatic partnerships, excluding South-South and Triangular Cooperation',
    },
    {
      id: '10',
      shortName: 'Planning meetings',
      description: 'Planning meetings, including regional planning meeting, retreats and staff engagement activities',
    },
];


export async function GET() {
  // In a real application, you would fetch this from a database.
  return NextResponse.json({ success: true, data: initiatives });
}
