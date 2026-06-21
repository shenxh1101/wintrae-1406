import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CampingState, Destination, ChecklistItem, Member, Vehicle, EmergencyContact, CostItem, PhotoItem, CampInfo, WeatherRecord, TripReview } from '@/types/camping';
import { initialState } from '@/data/mockData';
import { genId } from '@/utils/id';

interface CampingContextType {
  state: CampingState;
  addDestination: (dayId: string, dest: Destination) => void;
  removeDestination: (dayId: string, destId: string) => void;
  markDestArrived: (dayId: string, destId: string) => void;
  toggleChecklist: (dayId: string, itemId: string) => void;
  addChecklistItem: (dayId: string, item: ChecklistItem) => void;
  toggleGear: (gearId: string) => void;
  claimGear: (gearId: string, memberName: string) => void;
  unclaimGear: (gearId: string) => void;
  updateCampInfo: (key: keyof CampInfo, value: string) => void;
  addWeatherRecord: (record: WeatherRecord) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  updateVehiclePassengers: (vehicleId: string, passengers: string[]) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  addEstimatedCost: (item: CostItem) => void;
  removeEstimatedCost: (id: string) => void;
  updateCostSplit: (costId: string, memberIds: string[]) => void;
  addReviewPhoto: (photo: PhotoItem) => void;
  removeReviewPhoto: (id: string) => void;
  addActualCost: (item: CostItem) => void;
  removeActualCost: (id: string) => void;
  addMissedItem: (item: string) => void;
  removeMissedItem: (index: number) => void;
  updateReviewNotes: (notes: string) => void;
  archiveReview: () => void;
  copyFromPastTrip: (tripId: string) => boolean;
}

const CampingContext = createContext<CampingContextType | undefined>(undefined);

export const CampingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CampingState>(initialState);

  const addDestination = (dayId: string, dest: Destination) => {
    setState(prev => ({
      ...prev,
      tripDays: prev.tripDays.map(day =>
        day.id === dayId ? { ...day, destinations: [...day.destinations, dest] } : day
      )
    }));
  };

  const removeDestination = (dayId: string, destId: string) => {
    setState(prev => ({
      ...prev,
      tripDays: prev.tripDays.map(day =>
        day.id === dayId ? { ...day, destinations: day.destinations.filter(d => d.id !== destId) } : day
      )
    }));
  };

  const markDestArrived = (dayId: string, destId: string) => {
    setState(prev => ({
      ...prev,
      tripDays: prev.tripDays.map(day =>
        day.id === dayId
          ? { ...day, destinations: day.destinations.map(d => d.id === destId ? { ...d, arrived: true } : d) }
          : day
      )
    }));
  };

  const toggleChecklist = (dayId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      tripDays: prev.tripDays.map(day =>
        day.id === dayId
          ? { ...day, checklist: day.checklist.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ) }
          : day
      )
    }));
  };

  const addChecklistItem = (dayId: string, item: ChecklistItem) => {
    setState(prev => ({
      ...prev,
      tripDays: prev.tripDays.map(day =>
        day.id === dayId ? { ...day, checklist: [...day.checklist, item] } : day
      )
    }));
  };

  const toggleGear = (gearId: string) => {
    setState(prev => ({
      ...prev,
      gearList: prev.gearList.map(g => g.id === gearId ? { ...g, checked: !g.checked } : g)
    }));
  };

  const claimGear = (gearId: string, memberName: string) => {
    setState(prev => ({
      ...prev,
      gearList: prev.gearList.map(g => g.id === gearId ? { ...g, claimedBy: memberName } : g)
    }));
  };

  const unclaimGear = (gearId: string) => {
    setState(prev => ({
      ...prev,
      gearList: prev.gearList.map(g => g.id === gearId ? { ...g, claimedBy: undefined } : g)
    }));
  };

  const updateCampInfo = (key: keyof CampInfo, value: string) => {
    setState(prev => ({
      ...prev,
      campInfo: { ...prev.campInfo, [key]: value }
    }));
  };

  const addWeatherRecord = (record: WeatherRecord) => {
    setState(prev => ({
      ...prev,
      weatherRecords: [...prev.weatherRecords, record]
    }));
  };

  const addMember = (member: Member) => {
    setState(prev => ({ ...prev, members: [...prev.members, member] }));
  };

  const removeMember = (id: string) => {
    setState(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
  };

  const addVehicle = (vehicle: Vehicle) => {
    setState(prev => ({ ...prev, vehicles: [...prev.vehicles, vehicle] }));
  };

  const removeVehicle = (id: string) => {
    setState(prev => ({ ...prev, vehicles: prev.vehicles.filter(v => v.id !== id) }));
  };

  const updateVehiclePassengers = (vehicleId: string, passengers: string[]) => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => v.id === vehicleId ? { ...v, passengers } : v)
    }));
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    setState(prev => ({ ...prev, emergencyContacts: [...prev.emergencyContacts, contact] }));
  };

  const removeEmergencyContact = (id: string) => {
    setState(prev => ({ ...prev, emergencyContacts: prev.emergencyContacts.filter(e => e.id !== id) }));
  };

  const addEstimatedCost = (item: CostItem) => {
    setState(prev => ({ ...prev, estimatedCost: [...prev.estimatedCost, item] }));
  };

  const removeEstimatedCost = (id: string) => {
    setState(prev => ({ ...prev, estimatedCost: prev.estimatedCost.filter(c => c.id !== id) }));
  };

  const updateCostSplit = (costId: string, memberIds: string[]) => {
    setState(prev => ({
      ...prev,
      estimatedCost: prev.estimatedCost.map(c => c.id === costId ? { ...c, splitMemberIds: memberIds } : c)
    }));
  };

  const addReviewPhoto = (photo: PhotoItem) => {
    setState(prev => ({
      ...prev,
      review: { ...prev.review, photos: [...prev.review.photos, photo] }
    }));
  };

  const removeReviewPhoto = (id: string) => {
    setState(prev => ({
      ...prev,
      review: { ...prev.review, photos: prev.review.photos.filter(p => p.id !== id) }
    }));
  };

  const addActualCost = (item: CostItem) => {
    setState(prev => ({
      ...prev,
      review: {
        ...prev.review,
        actualCost: [...prev.review.actualCost, item],
        totalCost: prev.review.actualCost.reduce((sum, c) => sum + c.amount, 0) + item.amount
      }
    }));
  };

  const removeActualCost = (id: string) => {
    setState(prev => {
      const removed = prev.review.actualCost.find(c => c.id === id);
      const newActualCost = prev.review.actualCost.filter(c => c.id !== id);
      return {
        ...prev,
        review: {
          ...prev.review,
          actualCost: newActualCost,
          totalCost: Math.max(0, prev.review.totalCost - (removed?.amount || 0))
        }
      };
    });
  };

  const addMissedItem = (item: string) => {
    setState(prev => ({
      ...prev,
      review: { ...prev.review, missedItems: [...prev.review.missedItems, item] }
    }));
  };

  const removeMissedItem = (index: number) => {
    setState(prev => ({
      ...prev,
      review: {
        ...prev.review,
        missedItems: prev.review.missedItems.filter((_, i) => i !== index)
      }
    }));
  };

  const updateReviewNotes = (notes: string) => {
    setState(prev => ({ ...prev, review: { ...prev.review, notes } }));
  };

  const archiveReview = () => {
    setState(prev => {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const archivedTrip: TripReview = {
        ...prev.review,
        date: prev.review.date || dateStr,
        archived: true,
        planSnapshot: {
          tripDays: prev.tripDays,
          gearList: prev.gearList,
          campInfo: prev.campInfo,
          members: prev.members,
          vehicles: prev.vehicles,
          emergencyContacts: prev.emergencyContacts,
          estimatedCost: prev.estimatedCost
        }
      };
      return {
        ...prev,
        pastTrips: [archivedTrip, ...prev.pastTrips],
        review: {
          id: genId(),
          tripName: prev.tripName,
          date: '',
          photos: [],
          actualCost: [],
          totalCost: 0,
          missedItems: [],
          notes: ''
        }
      };
    });
  };

  const copyFromPastTrip = (tripId: string): boolean => {
    let found = false;
    setState(prev => {
      const trip = prev.pastTrips.find(t => t.id === tripId);
      if (!trip || !trip.planSnapshot) return prev;
      found = true;
      const snap = trip.planSnapshot;
      return {
        ...prev,
        tripName: `${trip.tripName}(副本)`,
        tripDays: snap.tripDays.map(day => ({
          ...day,
          id: genId(),
          destinations: day.destinations.map(d => ({ ...d, id: genId(), arrived: false })),
          checklist: day.checklist.map(c => ({ ...c, id: genId(), completed: false }))
        })),
        gearList: snap.gearList.map(g => ({
          ...g,
          id: genId(),
          checked: false,
          claimedBy: undefined
        })),
        campInfo: { ...snap.campInfo, id: genId() },
        members: snap.members.map(m => ({ ...m, id: genId() })),
        vehicles: snap.vehicles.map(v => ({ ...v, id: genId(), passengers: [] })),
        emergencyContacts: snap.emergencyContacts.map(e => ({ ...e, id: genId() })),
        estimatedCost: snap.estimatedCost.map(c => ({ ...c, id: genId(), splitMemberIds: [] })),
        review: {
          id: genId(),
          tripName: `${trip.tripName}(副本)`,
          date: '',
          photos: [],
          actualCost: [],
          totalCost: 0,
          missedItems: [],
          notes: ''
        }
      };
    });
    return found;
  };

  return (
    <CampingContext.Provider value={{
      state,
      addDestination,
      removeDestination,
      markDestArrived,
      toggleChecklist,
      addChecklistItem,
      toggleGear,
      claimGear,
      unclaimGear,
      updateCampInfo,
      addWeatherRecord,
      addMember,
      removeMember,
      addVehicle,
      removeVehicle,
      updateVehiclePassengers,
      addEmergencyContact,
      removeEmergencyContact,
      addEstimatedCost,
      removeEstimatedCost,
      updateCostSplit,
      addReviewPhoto,
      removeReviewPhoto,
      addActualCost,
      removeActualCost,
      addMissedItem,
      removeMissedItem,
      updateReviewNotes,
      archiveReview,
      copyFromPastTrip
    }}>
      {children}
    </CampingContext.Provider>
  );
};

export const useCamping = (): CampingContextType => {
  const context = useContext(CampingContext);
  if (!context) {
    throw new Error('useCamping must be used within a CampingProvider');
  }
  return context;
};
