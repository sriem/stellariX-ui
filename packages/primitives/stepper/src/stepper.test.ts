/**
 * Stepper Component Unit Tests
 * Tests for state management, logic, and component behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStepper } from './index';
import type { StepperStep, StepperOptions } from './types';

describe('Stepper Component', () => {
  const mockSteps: StepperStep[] = [
    { id: 'step1', label: 'Step 1' },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' },
    { id: 'step4', label: 'Step 4' },
  ];

  describe('Component Creation', () => {
    it('should create component with default options', () => {
      const stepper = createStepper();
      const state = stepper.state.getState();
      
      expect(stepper).toBeDefined();
      expect(stepper.state).toBeDefined();
      expect(stepper.logic).toBeDefined();
      expect(state.steps).toEqual([]);
      expect(state.activeStep).toBe(0);
      expect(state.disabled).toBe(false);
      expect(state.orientation).toBe('horizontal');
    });

    it('should create component with custom options', () => {
      const options: StepperOptions = {
        steps: mockSteps,
        activeStep: 1,
        disabled: true,
        orientation: 'vertical',
        nonLinear: true,
        showStepNumbers: false,
        showConnectors: false,
      };
      
      const stepper = createStepper(options);
      const state = stepper.state.getState();
      
      expect(state.steps).toEqual(mockSteps);
      expect(state.activeStep).toBe(1);
      expect(state.disabled).toBe(true);
      expect(state.orientation).toBe('vertical');
      expect(state.nonLinear).toBe(true);
      expect(state.showStepNumbers).toBe(false);
      expect(state.showConnectors).toBe(false);
    });
  });

  describe('State Management', () => {
    let stepper: ReturnType<typeof createStepper>;

    beforeEach(() => {
      stepper = createStepper({ steps: mockSteps });
    });

    it('should update steps', () => {
      const newSteps: StepperStep[] = [
        { id: 'new1', label: 'New Step 1' },
        { id: 'new2', label: 'New Step 2' },
      ];
      
      stepper.state.setSteps(newSteps);
      expect(stepper.state.getState().steps).toEqual(newSteps);
    });

    it('should update active step', () => {
      stepper.state.setActiveStep(2);
      expect(stepper.state.getState().activeStep).toBe(2);
    });

    it('should track completed steps', () => {
      stepper.state.addCompletedStep(0);
      stepper.state.addCompletedStep(1);
      
      const state = stepper.state.getState();
      expect(state.completedSteps.has(0)).toBe(true);
      expect(state.completedSteps.has(1)).toBe(true);
      expect(state.completedSteps.has(2)).toBe(false);
    });

    it('should remove completed steps', () => {
      stepper.state.addCompletedStep(0);
      stepper.state.addCompletedStep(1);
      stepper.state.removeCompletedStep(0);
      
      const state = stepper.state.getState();
      expect(state.completedSteps.has(0)).toBe(false);
      expect(state.completedSteps.has(1)).toBe(true);
    });

    it('should set all completed steps', () => {
      stepper.state.setCompletedSteps([0, 2, 3]);
      
      const state = stepper.state.getState();
      expect(state.completedSteps.has(0)).toBe(true);
      expect(state.completedSteps.has(1)).toBe(false);
      expect(state.completedSteps.has(2)).toBe(true);
      expect(state.completedSteps.has(3)).toBe(true);
    });

    it('should clear completed steps', () => {
      stepper.state.setCompletedSteps([0, 1, 2]);
      stepper.state.clearCompletedSteps();
      
      const state = stepper.state.getState();
      expect(state.completedSteps.size).toBe(0);
    });

    it('should set step error', () => {
      stepper.state.setStepError(1, true, 'Validation failed');
      
      const state = stepper.state.getState();
      expect(state.steps[1].error).toBe(true);
      expect(state.steps[1].errorMessage).toBe('Validation failed');
    });

    it('should reset state', () => {
      stepper.state.setActiveStep(2);
      stepper.state.setCompletedSteps([0, 1]);
      stepper.state.setStepError(1, true, 'Error');
      
      stepper.state.reset();
      
      const state = stepper.state.getState();
      expect(state.activeStep).toBe(0);
      expect(state.completedSteps.size).toBe(0);
      expect(state.steps[1].error).toBe(false);
      expect(state.steps[1].errorMessage).toBeUndefined();
    });
  });

  describe('Helper Methods', () => {
    let stepper: ReturnType<typeof createStepper>;
    let onStepChange: ReturnType<typeof vi.fn>;
    let onComplete: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      onStepChange = vi.fn();
      onComplete = vi.fn();
      stepper = createStepper({ 
        steps: mockSteps,
        onStepChange,
        onComplete,
      });
    });

    describe('next()', () => {
      it('should move to next step', async () => {
        const result = await stepper.next();
        
        expect(result).toBe(true);
        expect(stepper.state.getState().activeStep).toBe(1);
        expect(stepper.state.getState().completedSteps.has(0)).toBe(true);
        expect(onStepChange).toHaveBeenCalledWith(1, 0);
      });

      it('should not move past last step', async () => {
        stepper.state.setActiveStep(3);
        
        const result = await stepper.next();
        
        expect(result).toBe(false);
        expect(stepper.state.getState().activeStep).toBe(3);
        expect(onComplete).toHaveBeenCalled();
      });

      it('should validate before moving', async () => {
        const onStepValidate = vi.fn().mockResolvedValue(false);
        const stepperWithValidation = createStepper({ 
          steps: mockSteps,
          onStepValidate,
        });
        
        const result = await stepperWithValidation.next();
        
        expect(result).toBe(false);
        expect(onStepValidate).toHaveBeenCalledWith(0, 'next');
        expect(stepperWithValidation.state.getState().activeStep).toBe(0);
      });
    });

    describe('prev()', () => {
      it('should move to previous step', async () => {
        stepper.state.setActiveStep(2);
        
        const result = await stepper.prev();
        
        expect(result).toBe(true);
        expect(stepper.state.getState().activeStep).toBe(1);
        expect(onStepChange).toHaveBeenCalledWith(1, 2);
      });

      it('should not move before first step', async () => {
        const result = await stepper.prev();
        
        expect(result).toBe(false);
        expect(stepper.state.getState().activeStep).toBe(0);
      });
    });

    describe('goToStep()', () => {
      it('should go to specific step in non-linear mode', async () => {
        const nonLinearStepper = createStepper({ 
          steps: mockSteps,
          nonLinear: true,
          onStepChange,
        });
        
        const result = await nonLinearStepper.goToStep(3);
        
        expect(result).toBe(true);
        expect(nonLinearStepper.state.getState().activeStep).toBe(3);
        expect(onStepChange).toHaveBeenCalledWith(3, 0);
      });

      it('should not skip required steps in linear mode', async () => {
        const result = await stepper.goToStep(3);
        
        expect(result).toBe(false);
        expect(stepper.state.getState().activeStep).toBe(0);
      });

      it('should allow going to completed steps in linear mode', async () => {
        stepper.state.setActiveStep(3);
        stepper.state.setCompletedSteps([0, 1, 2]);
        
        const result = await stepper.goToStep(1);
        
        expect(result).toBe(true);
        expect(stepper.state.getState().activeStep).toBe(1);
      });

      it('should skip optional steps in linear mode', async () => {
        const stepsWithOptional: StepperStep[] = [
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2', optional: true },
          { id: 'step3', label: 'Step 3' },
        ];
        
        const stepperWithOptional = createStepper({ 
          steps: stepsWithOptional,
          onStepChange,
        });
        
        stepperWithOptional.state.addCompletedStep(0);
        
        const result = await stepperWithOptional.goToStep(2);
        
        expect(result).toBe(true);
        expect(stepperWithOptional.state.getState().activeStep).toBe(2);
      });
    });

    describe('reset()', () => {
      it('should reset stepper to initial state', () => {
        stepper.state.setActiveStep(2);
        stepper.state.setCompletedSteps([0, 1]);
        
        stepper.reset();
        
        const state = stepper.state.getState();
        expect(state.activeStep).toBe(0);
        expect(state.completedSteps.size).toBe(0);
        expect(onStepChange).toHaveBeenCalledWith(0, 0);
      });
    });

    describe('completeStep()', () => {
      it('should mark step as completed', () => {
        stepper.completeStep(1);
        
        expect(stepper.state.getState().completedSteps.has(1)).toBe(true);
      });
    });

    describe('setStepError()', () => {
      it('should set error on step', () => {
        stepper.setStepError(2, true, 'Custom error');
        
        const state = stepper.state.getState();
        expect(state.steps[2].error).toBe(true);
        expect(state.steps[2].errorMessage).toBe('Custom error');
      });
    });

    describe('getStepStatus()', () => {
      it('should return correct step status', () => {
        stepper.state.setActiveStep(1);
        stepper.state.addCompletedStep(0);
        stepper.state.setStepError(3, true);
        
        expect(stepper.getStepStatus(0)).toBe('completed');
        expect(stepper.getStepStatus(1)).toBe('active');
        expect(stepper.getStepStatus(2)).toBe('upcoming');
        expect(stepper.getStepStatus(3)).toBe('error');
      });
    });

    describe('isStepAccessible()', () => {
      it('should check step accessibility in linear mode', () => {
        stepper.state.setActiveStep(1);
        stepper.state.addCompletedStep(0);
        
        expect(stepper.isStepAccessible(0)).toBe(true); // Completed
        expect(stepper.isStepAccessible(1)).toBe(true); // Active
        expect(stepper.isStepAccessible(2)).toBe(false); // Not yet accessible
        expect(stepper.isStepAccessible(3)).toBe(false); // Not yet accessible
      });

      it('should allow all steps in non-linear mode', () => {
        const nonLinearStepper = createStepper({ 
          steps: mockSteps,
          nonLinear: true,
        });
        
        expect(nonLinearStepper.isStepAccessible(0)).toBe(true);
        expect(nonLinearStepper.isStepAccessible(1)).toBe(true);
        expect(nonLinearStepper.isStepAccessible(2)).toBe(true);
        expect(nonLinearStepper.isStepAccessible(3)).toBe(true);
      });

      it('should respect disabled steps', () => {
        const stepsWithDisabled: StepperStep[] = [
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2', disabled: true },
          { id: 'step3', label: 'Step 3' },
        ];
        
        const stepperWithDisabled = createStepper({ 
          steps: stepsWithDisabled,
          nonLinear: true,
        });
        
        expect(stepperWithDisabled.isStepAccessible(0)).toBe(true);
        expect(stepperWithDisabled.isStepAccessible(1)).toBe(false);
        expect(stepperWithDisabled.isStepAccessible(2)).toBe(true);
      });

      it('should return false when stepper is disabled', () => {
        stepper.state.setDisabled(true);
        
        expect(stepper.isStepAccessible(0)).toBe(false);
        expect(stepper.isStepAccessible(1)).toBe(false);
      });
    });
  });

  describe('State Subscriptions', () => {
    it('should notify subscribers on state changes', () => {
      const stepper = createStepper({ steps: mockSteps });
      const listener = vi.fn();
      
      const unsubscribe = stepper.state.subscribe(listener);
      
      stepper.state.setActiveStep(2);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        activeStep: 2,
      }));
      
      stepper.state.addCompletedStep(1);
      expect(listener).toHaveBeenCalledTimes(2);
      
      unsubscribe();
      stepper.state.setActiveStep(3);
      expect(listener).toHaveBeenCalledTimes(2); // No new calls after unsubscribe
    });
  });

  describe('A11y Props', () => {
    it('should provide correct accessibility props', () => {
      const stepper = createStepper({ 
        steps: mockSteps,
        ariaLabel: 'Custom Progress',
      });
      
      const state = stepper.state.getState();
      
      // Root props
      const rootProps = stepper.logic.getA11yProps('root');
      expect(rootProps.role).toBe('group');
      expect(rootProps['aria-label']).toBe('Custom Progress');
      
      // List props
      const listProps = stepper.logic.getA11yProps('list');
      expect(listProps.role).toBe('list');
      
      // Step props - getA11yProps returns a function that takes index
      const stepPropsGetter = stepper.logic.getA11yProps('step');
      const stepProps = stepPropsGetter(0);
      expect(stepProps.role).toBe('listitem');
      expect(stepProps['aria-current']).toBe('step');
      
      // Step button props - getA11yProps returns a function that takes index
      const buttonPropsGetter = stepper.logic.getA11yProps('stepButton');
      const buttonProps = buttonPropsGetter(0);
      expect(buttonProps.role).toBe('button');
      expect(buttonProps['aria-label']).toBe('Step 1: Step 1');
      expect(buttonProps.tabIndex).toBe(0);
    });

    it('should handle disabled state in a11y props', () => {
      const stepper = createStepper({ 
        steps: mockSteps,
        disabled: true,
      });
      
      const state = stepper.state.getState();
      
      const rootProps = stepper.logic.getA11yProps('root');
      expect(rootProps['aria-disabled']).toBe('true');
      
      const buttonPropsGetter = stepper.logic.getA11yProps('stepButton');
      const buttonProps = buttonPropsGetter(0);
      expect(buttonProps.tabIndex).toBe(-1);
      expect(buttonProps['aria-disabled']).toBe('true');
    });
  });
});