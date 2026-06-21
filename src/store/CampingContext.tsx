import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CampingState, Destination, ChecklistItem, GearItem, Member, Vehicle, EmergencyContact, CostItem, PhotoItem } from '@/types/camping';
import { initialState } from '@/data/mockData';

interface CampingContextType {
  state: CampingState;
  addDestination: (dayId: string, dest: Destination) => void;
  removeDestination: (dayId: string, destId: string) => void;
  toggleChecklist: (dayId: string, itemId: string) => void;
  addChecklistItem: (dayId: string, item: ChecklistItem) => void;
  toggleGear: (gearId: string) => void;
  claimGear: (gearId: string, memberName: string) => void;
  updateCampInfo: (key: keyof CampingState['campInfo'], value: string) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  addEstimatedCost: (item: CostItem) => void;
  removeEstimatedCost: (id: string) => void;
  addReviewPhoto: (photo: PhotoItem) => void;
  addActualCost: (item: CostItem) => void;
  addMissedItem: (item: string) => void;
  removeMissedItem: (index: number) => void;
  updateReviewNotes: (notes: string) => void;
  copyFromPastTrip: (tripId: string) => void;
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

  const updateCampInfo = (key: keyof CampingState['campInfo'], value: string) => {
    setState(prev => ({
      ...prev,
      campInfo: { ...prev.campInfo, [key]: value }
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

  const addReviewPhoto = (photo: PhotoItem) => {
    setState(prev => ({
      ...prev,
      review: { ...prev.review, photos: [...prev.review.photos, photo] }
    }));
  };

  const addActualCost = (item: CostItem) => {
    setState(prev => ({
      ...prev,
      review: {
        ...prev.review,
        actualCost: [...prev.review.actualCost, item],
        totalCost: prev.review.totalCost + item.amount
      }
    }));
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

  const copyFromPastTrip = (tripId: string) => {
    const trip = state.pastTrips.find(t => t.id === tripId);
    if (trip) {
      console.log('[CampingContext] 复制行程:', trip.tripName);
    }
  };

  return (
    <CampingContext.Provider value={{
      state,
      addDestination,
      removeDestination,
      toggleChecklist,
      addChecklistItem,
      toggleGear,
      claimGear,
      updateCampInfo,
      addMember,
      removeMember,
      addVehicle,
      removeVehicle,
      addEmergencyContact,
      removeEmergencyContact,
      addEstimatedCost,
      removeEstimatedCost,
      addReviewPhoto,
      addActualCost,
      addMissedItem,
      removeMissedItem,
      updateReviewNotes,
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
