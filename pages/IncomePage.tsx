import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { IncomeEntry } from '../types';
import { TrashIcon } from '../components/icons';

const IncomeChart: React.FC<{ data: any[] }> = ({ data }) => {
    const [Recharts, setRecharts] = useState<any>(null);

    useEffect(() => {
        const checkRecharts = () => {
            if ((window as any).Recharts) {
                setRecharts((window as any).Recharts);
                return true;
            }
            return false;
        };
        if (checkRecharts()) return;
        const intervalId = setInterval(() => {
            if (checkRecharts()) {
                clearInterval(intervalId);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    if (!Recharts) {
        return (
            <div className="h-96 flex items-center justify-center">
                <p className="text-on-surface">Loading chart...</p>
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Defs, LinearGradient, Stop } = Recharts;
    
    return (
        <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Defs>
                        <LinearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                            <Stop offset="95%" stopColor="#67e8f9" stopOpacity={0.6}/>
                        </LinearGradient>
                    </Defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }} cursor={{fill: 'rgba(129, 140, 248, 0.1)'}}/>
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    <Bar dataKey="income" fill="url(#colorIncome)" name="Income" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const IncomeTable: React.FC<{ entries: IncomeEntry[], onDelete: (id: string) => void }> = ({ entries, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Project</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Client</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {entries.length > 0 ? entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{entry.project}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{entry.client}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(entry.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary">${entry.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onDelete(entry.id)} className="text-error/80 hover:text-error transition-colors p-2 rounded-full hover:bg-error/10">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-12 text-slate-400">No income entries yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const IncomePage: React.FC = () => {
    const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
    const [project, setProject] = useState('');
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        try {
            const storedIncomes = localStorage.getItem('incomeEntries');
            if (storedIncomes) {
                setIncomes(JSON.parse(storedIncomes));
            }
        } catch (error) {
            console.error("Failed to parse incomes from localStorage", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('incomeEntries', JSON.stringify(incomes));
    }, [incomes]);

    const handleAddIncome = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !amount) return;
        const newEntry: IncomeEntry = {
            id: new Date().toISOString(),
            project,
            client,
            amount: parseFloat(amount),
            date,
        };
        setIncomes(prev => [...prev, newEntry].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setProject('');
        setClient('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    }, [project, client, amount, date]);

    const handleDeleteIncome = useCallback((id: string) => {
        setIncomes(prev => prev.filter(entry => entry.id !== id));
    }, []);

    const chartData = useMemo(() => {
        const monthlyIncome: { [key: string]: { total: number; date: Date } } = {};
        
        // Group incomes by the first day of their month to ensure correct aggregation.
        incomes.forEach(entry => {
            // Dates from <input type="date"> are parsed as UTC.
            const entryDate = new Date(entry.date);
            const monthKeyDate = new Date(Date.UTC(entryDate.getUTCFullYear(), entryDate.getUTCMonth(), 1));
            const monthKey = monthKeyDate.toISOString();
            
            if (!monthlyIncome[monthKey]) {
                monthlyIncome[monthKey] = { total: 0, date: monthKeyDate };
            }
            monthlyIncome[monthKey].total += entry.amount;
        });
    
        // Sort the aggregated months chronologically and format for the chart.
        return Object.values(monthlyIncome)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(monthData => ({
                name: monthData.date.toLocaleString('default', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
                income: monthData.total,
            }));
    }, [incomes]);

    const totalIncome = useMemo(() => {
        return incomes.reduce((sum, entry) => sum + entry.amount, 0);
    }, [incomes]);

    const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300";

    return (
        <div className="space-y-12">
            <div className="animate-fade-in-up text-center">
                <h1 className="text-5xl font-bold text-glow">Income Tracker</h1>
                <p className="text-slate-300 mt-4">Manage and visualize your project earnings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 glass-pane p-6 animate-slide-in-left h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-white">Add New Entry</h2>
                    <form onSubmit={handleAddIncome} className="space-y-4">
                        <input type="text" placeholder="Project Name" value={project} onChange={e => setProject(e.target.value)} required className={inputClasses} />
                        <input type="text" placeholder="Client Name" value={client} onChange={e => setClient(e.target.value)} className={inputClasses} />
                        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" className={inputClasses} />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={`${inputClasses} [color-scheme:dark]`} />
                        <button type="submit" className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-glow">Add Income</button>
                    </form>
                </div>
                
                <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-pane p-6 text-center">
                        <h3 className="text-lg font-semibold text-slate-300">Total Income</h3>
                        <p className="text-5xl font-bold text-secondary text-glow">${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div className="glass-pane p-4">
                        <IncomeChart data={chartData} />
                    </div>
                </div>
            </div>

            <div className="animate-fade-in-up glass-pane p-6" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold mb-4 text-white">Income History</h2>
                <IncomeTable entries={incomes} onDelete={handleDeleteIncome} />
            </div>
        </div>
    );
};

export default IncomePage;