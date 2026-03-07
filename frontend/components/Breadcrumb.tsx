"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface BreadcrumbProps {
    homeLabel?: string;
    customLabels?: Record<string, string>;
}

export default function Breadcrumb({ 
    homeLabel = 'Home',
    customLabels = {}
}: BreadcrumbProps) {
    const pathname = usePathname();
    
    // Split path into segments and filter out empty strings
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    // Default label mappings (you can customize these)
    const defaultLabels: Record<string, string> = {
        'jobs': 'Jobs',
        'details': 'Job Details',
        'organizations': 'Organizations',
        'profile': 'Profile',
        'settings': 'Settings',
        'onboarding': 'Onboarding',
        ...customLabels
    };
    
    // Function to format segment into readable label
    const formatLabel = (segment: string): string => {
        // Check if there's a custom label
        if (defaultLabels[segment]) {
            return defaultLabels[segment];
        }
        
        // If it's a UUID or ID (common pattern), show as "Details"
        if (/^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment)) {
            return 'Details';
        }
        
        // Otherwise capitalize and replace hyphens/underscores with spaces
        return segment
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    return (
        <nav className="flex items-center text-sm text-gray-600 py-3">
            {/* Home link */}
            <Link 
                href="/home" 
                className="hover:text-[#0090D9] transition-colors"
            >
                {homeLabel}
            </Link>
            
            {/* Dynamic segments */}
            {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const href = '/home/' + pathSegments.slice(0, index + 1).join('/');
                
                return (
                    <div key={index} className="flex items-center">
                        <ChevronRightIcon className="mx-2" fontSize="medium" />
                        {isLast ? (
                            <span className="text-gray-900 font-medium">
                                {formatLabel(segment)}
                            </span>
                        ) : (
                            <Link 
                                href={href}
                                className="hover:text-[#0090D9] transition-colors"
                            >
                                {formatLabel(segment)}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}