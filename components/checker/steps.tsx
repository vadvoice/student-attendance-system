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
import QRCode from 'react-qr-code';

// const STEPS = [
//   {
//     title: 'Select Discipline',
//     description: 'Select the discipline you want to check attendance for.',
//   },
//   {
//     title: 'Generate QR Code',
//     description: 'Generate a QR code for the selected discipline.',
//   },
//   {
//     title: 'Start Timer',
//     description: 'Start the timer to check attendance.',
//   },
// ];

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
  disciplines,
  actions: { handleAddHistoryRecord },
}: {
  disciplines: Discipline[];
  actions: {
    handleAddHistoryRecord: (name: number) => void;
  };
}) => {
  const [step, setStep] = useState(1);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const getLink = (discipline: string) => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/checker/${discipline}`;
  };

  const handleCreateQRCode = () => {
    setShowQRCode(true);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(getLink(selectedDiscipline));
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
            <QRCode value={getLink(selectedDiscipline)} />

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Checker</CardTitle>
        <CardDescription>Create a QR code for attendance.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* <div>
            <Label htmlFor="discipline">Select Discipline (Optional)</Label>
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
          {selectedDiscipline ? (
            <div className="flex flex-col gap-2">
              <Button onClick={handleCreateQRCode} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
              <Button onClick={handleShareLink} className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          ) : null}

          {showQRCode && (
            <div className="mt-4 flex flex-col items-center">
              <QRCode value={getLink(selectedDiscipline)} />
            </div>
          )} */}
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};
