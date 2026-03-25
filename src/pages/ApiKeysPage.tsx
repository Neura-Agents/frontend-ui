import React from 'react';
import { Typography } from '@/components/ui/typography';
import { DataTable } from '@/tables/api-keys/data-table';
import { columns, data } from '@/tables/api-keys/columns';

const ApiKeysPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            {/* ─── HERO / PREVIEW ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    API Keys
                </Typography>
                <Typography variant="page-description">
                    Use API Keys to authenticate your requests.
                </Typography>
            </section>
            <section tabIndex={0} className="px-2">
                <DataTable columns={columns} data={data} />
            </section>
        </div>
    );
};

export default ApiKeysPage;
