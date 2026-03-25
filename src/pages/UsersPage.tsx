import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Pagination from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/tables/users/data-table';
import { columns, type User } from '@/tables/users/columns';


const UsersPage: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchUsers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const offset = (page - 1) * limit;
            const response = await axios.get(`http://localhost:8000/backend/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { search, limit, offset }
            });
            setUsers(response.data.users);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, token, page, limit]);

    // Reset to page 1 when searching
    useEffect(() => {
        setPage(1);
    }, [search]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Users
                </Typography>
                <Typography variant="page-description">
                    Manage and view all platform users synced from Keycloak
                </Typography>
            </section>

            <div className="space-y-8 px-2">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search by username, email or name..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val))}>
                            <SelectTrigger size='lg' className="w-[120px] rounded-full">
                                <SelectValue placeholder="Page Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 / page</SelectItem>
                                <SelectItem value="20">20 / page</SelectItem>
                                <SelectItem value="50">50 / page</SelectItem>
                                <SelectItem value="100">100 / page</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 h-10 w-10"
                            iconOnly
                            onClick={fetchUsers}
                        >
                            <HugeiconsIcon icon={Refresh01Icon} className={loading ? "animate-spin" : ""} />
                        </Button>
                    </div>
                </div>

                <section className="px-2">
                    <DataTable columns={columns} data={users} loading={loading} />
                </section>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 pb-10">
                    <div className="text-xs text-muted-foreground order-2 md:order-1">
                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} users
                    </div>
                    <div className="order-1 md:order-2">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
