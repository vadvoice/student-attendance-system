'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Spinner } from '@/components/spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PlusCircle, QrCode, History, Users, CalendarIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Checker } from './checker/steps';

import { useQuery, useMutation } from '@tanstack/react-query';

import { attendanceHistoryApi, disciplinesApi } from '@/lib/api';

export function AttendanceSystem() {
  // Queries
  const {
    data: disciplines = [],
    error,
    refetch,
    isLoading: disciplinesIsLoading,
  } = useQuery({
    queryKey: ['disciplinesList'],
    queryFn: disciplinesApi.list,
  });

  const {
    data: historyRecords = [],
    error: historyRecordsError,
    isLoading: historyRecordsIsLoading,
  } = useQuery({
    queryKey: ['historyRecords'],
    queryFn: attendanceHistoryApi.list,
  });

  const mutation = useMutation({
    mutationFn: attendanceHistoryApi.create,
    // onSuccess: () => {
    //   // Invalidate and refetch
    //   queryClient.invalidateQueries({ queryKey: ['todos'] })
    // },
  });

  const [activeView, setActiveView] = useState('disciplines');
  const [newDiscipline, setNewDiscipline] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');
  const [date, setDate] = useState<Date>();

  const handleAddDiscipline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('/api/disciplines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newDiscipline }),
    })
      .then((res) => res.json())
      .then((data) => {
        refetch();
        setNewDiscipline('');
      });
  };

  const handleDeleteDiscipline = (id: number) => {
    if (!confirm('Are you sure you want to delete this discipline?')) return;

    fetch(`/api/disciplines/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        refetch();
      });
  };

  const handleAddHistoryRecord = (disciplineId: number) => {
    const discipline = disciplines.find((d) => d.id === disciplineId);
    if (!discipline) return;

    mutation.mutate({
      discipline_id: discipline.id,
      name: discipline.name,
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'disciplines':
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Disciplines</CardTitle>
              <CardDescription>
                Manage your class disciplines here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {disciplinesIsLoading ? <Spinner /> : null}
                <ul className="space-y-2">
                  {disciplines.map((discipline) => (
                    <li
                      key={discipline.id}
                      className="p-3 rounded-md shadow-sm flex justify-between items-center"
                    >
                      {discipline.name}

                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteDiscipline(discipline.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <form
                className="flex w-full items-center space-x-2"
                onSubmit={handleAddDiscipline}
              >
                <Input
                  required
                  min={3}
                  placeholder="New discipline name"
                  value={newDiscipline}
                  onChange={(e) => {
                    setNewDiscipline(e.target.value);
                  }}
                />
                <Button type="submit">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>
            </CardFooter>
          </Card>
        );
      case 'checker':
        return <Checker disciplines={disciplines} actions={{ handleAddHistoryRecord }} />;
      case 'history':
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View past attendance records.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="historyFilter">Filter by Discipline</Label>
                  <select
                    id="historyFilter"
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                  >
                    <option value="">All Disciplines</option>
                    {disciplines.map((discipline) => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        modifiers={{
                          lecture: (date) =>
                            historyRecords.some((record) =>
                              isSameDay(date, record.created_at)
                            ),
                        }}
                        modifiersStyles={{
                          lecture: {
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                          },
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <ScrollArea className="h-[200px]">
                  <ul className="space-y-2">
                    {historyRecordsIsLoading ? <Spinner /> : null}
                    {historyRecords.map((record, index) => (
                      <li
                        key={index}
                        className="p-3 rounded-md shadow-sm flex justify-between items-center"
                      >
                        <span>
                          {record.name} -{record.created_at}
                        </span>
                        <span className="text-sm text-gray-500">
                          25 students
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8 flex-1">
        {renderContent()}
      </div>

      <nav className="shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center h-16">
            <Button
              variant="ghost"
              className="flex flex-col items-center"
              onClick={() => setActiveView('disciplines')}
            >
              <Users className="h-6 w-6 mb-1 shrink-0" />
              <span className="text-xs">Disciplines</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center"
              onClick={() => setActiveView('checker')}
            >
              <QrCode className="h-6 w-6 mb-1 shrink-0" />
              <span className="text-xs">Checker</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center"
              onClick={() => setActiveView('history')}
            >
              <History className="h-6 w-6 mb-1 shrink-0" />
              <span className="text-xs">History</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
