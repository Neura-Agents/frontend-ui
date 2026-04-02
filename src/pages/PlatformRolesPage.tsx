import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { platformService, type Role } from '@/services/platformService';
import { DataTable } from '@/tables/platform-features/data-table';
import { columns } from '@/tables/platform-roles/columns';
import { useAlert } from '@/context/AlertContext';

const PlatformRolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await platformService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch platform roles:', error);
            showAlert({
                title: 'Error',
                description: 'Failed to load platform roles',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRoles();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Platform Roles
                </Typography>
                <Typography variant="page-description">
                    Manage and view system-level access roles used for feature targeting
                </Typography>
            </section>

            <div className="space-y-8 px-2">
                <section className="px-2 pb-12 transition-all duration-300">
                    <DataTable 
                        columns={columns} 
                        data={roles} 
                        loading={loading}
                    />
                </section>
            </div>
        </div>
    );
};

export default PlatformRolesPage;
