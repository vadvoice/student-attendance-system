import { Discipline } from '@/types/Discipline';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { QrCode, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HistoryRecord } from '@/types/HistoryRecord';
import { Spinner } from '../spinner';
import RecordsHistory from '../records-history';
import QRCode from 'react-qr-code';

const Countdown = ({ seconds }: { seconds: number }) => {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // format mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds}`;
  };

  return <div>{formatTime(countdown)}</div>;
};

export const Checker = ({
  data: {
    disciplines,
    historyRecord,
    isLoading,
  },
  actions: { handleAddHistoryRecord },
}: {
  data: {
    disciplines: Discipline[];
    historyRecord: HistoryRecord;
    isLoading: boolean;
  },
  actions: {
    handleAddHistoryRecord: (name: number) => void;
  };
}) => {
  const [step, setStep] = useState(1);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const getLink = (discipline: string) => {
    if (!historyRecord) {
      return '';
    }
    return `${window.origin}/share?descipline=${discipline}&id=${historyRecord.id}`;
  };

  const handleCreateQRCode = () => {
    setShowQRCode(true);
  };

  const handleShareLink = () => {
    const link = getLink(selectedDiscipline);
    if (link) {
      navigator.clipboard.writeText(link);
    } else {
      console.warn('Unable to generate link');
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleReset = () => {
    // are you sure?
    if (!confirm('Are you sure you want to reset?')) return;
    setStep(1);
    setSelectedDiscipline('');
    setShowQRCode(false);
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Label htmlFor="discipline">Select Discipline</Label>
            <select
              id="discipline"
              value={selectedDiscipline}
              onChange={(e) => {
                setSelectedDiscipline(e.target.value);
                setShowQRCode(false);
              }}
              className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              <option value="">Temporary (No Discipline)</option>
              {disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-2">
            <Button onClick={handleCreateQRCode} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="mt-4 flex flex-col items-center gap-3">
            {historyRecord && selectedDiscipline ? <QRCode className="border border-gray-200" value={getLink(selectedDiscipline)} /> : null}

            <Countdown seconds={1000} />
            <div className="flex gap-2">
              <Button onClick={handleShareLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
              <Button onClick={handleReset} variant="destructive">
                Reset
              </Button>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (selectedDiscipline || showQRCode) {
      handleNextStep();
    }

    if (showQRCode && selectedDiscipline) {
      handleAddHistoryRecord(+selectedDiscipline);
    }
  }, [selectedDiscipline, showQRCode]);


  if (isLoading) {
    return <Spinner />
  }

  return (
    <Card className="w-full flex-1 flex flex-col justify-between">
      <div className="flex flex-col gap-4">

        <CardHeader>
          <CardTitle>Attendance Checker</CardTitle>
          <CardDescription>Create a QR code for attendance.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {renderContent()}
          </div>
        </CardContent>
      </div>
      <hr className="my-4" />

      <RecordsHistory />
    </Card>
  );
};
