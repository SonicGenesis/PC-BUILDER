import React from 'react';
import { PCComponent } from '../../types/components';

interface ReplaceComponentDialogProps {
  existingComponent: PCComponent;
  newComponent: PCComponent;
}

export const ReplaceComponentDialog: React.FC<ReplaceComponentDialogProps> = ({
  existingComponent,
  newComponent,
}) => (
  <div className="space-y-4">
    <p>Do you want to replace:</p>
    <p className="font-medium text-blue-500">{existingComponent.name}</p>
    <p>with:</p>
    <p className="font-medium text-green-500">{newComponent.name}</p>
  </div>
); 