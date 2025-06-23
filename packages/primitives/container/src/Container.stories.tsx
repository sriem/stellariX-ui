import React from 'react';
import { createContainerWithImplementation } from './index';

export default {
  title: 'Primitives/Container',
  component: 'Container',
  parameters: {
    docs: {
      description: {
        component:
          'A flexible container component that constrains content width and provides consistent spacing.',
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      },
      description: 'Maximum width of the container',
      defaultValue: 'lg',
    },
    padding: {
      control: {
        type: 'select',
        options: ['none', 'sm', 'md', 'lg'],
      },
      description: 'Padding inside the container',
      defaultValue: 'md',
    },
    centered: {
      control: 'boolean',
      description: 'Whether to center the container horizontally',
      defaultValue: true,
    },
  },
  tags: ['autodocs'],
};

// Create component template
const createContainerComponent = (args) => {
  // Map story args to actual container options
  const options = {
    center: args.centered,
    size: args.maxWidth === 'full' ? 'full' : args.maxWidth || 'lg',
    padding: args.padding === 'none' ? '0' :
             args.padding === 'sm' ? '1rem' :
             args.padding === 'md' ? '2rem' :
             args.padding === 'lg' ? '3rem' : '2rem',
  };
  
  const container = createContainerWithImplementation(options);

  const ContainerComponent = ({ children }) => {
    const [componentState, setComponentState] = React.useState(() => container.state.getState());
    const a11yProps = container.logic.getA11yProps('root');
    const handlers = container.logic.getInteractionHandlers('root');

    // Update state based on args
    React.useEffect(() => {
      if (args.maxWidth && ['sm', 'md', 'lg', 'xl', 'full'].includes(args.maxWidth)) {
        container.state.setSize(args.maxWidth);
      }
      if (args.padding === 'none') container.state.setPadding('0');
      else if (args.padding === 'sm') container.state.setPadding('1rem');
      else if (args.padding === 'md') container.state.setPadding('2rem');
      else if (args.padding === 'lg') container.state.setPadding('3rem');
    }, [args.maxWidth, args.padding]);

    // Subscribe to state changes
    React.useEffect(() => {
      const unsubscribe = container.state.subscribe(setComponentState);
      return unsubscribe;
    }, []);

    // Use the computed styles from the component state
    const styles = componentState.computedStyles || {};

    return (
      <div style={styles} {...a11yProps} {...handlers}>
        {children}
      </div>
    );
  };

  return ContainerComponent;
};

// Default container
export const Default = {
  render: (args) => {
    const Container = createContainerComponent(args);
    return (
      <Container>
        <div style={{ backgroundColor: '#e2e8f0', padding: '2rem', borderRadius: '8px' }}>
          <h2>Container Content</h2>
          <p>This content is wrapped in a container with max-width constraints and padding.</p>
          <p>The container helps maintain readable line lengths and consistent spacing.</p>
        </div>
      </Container>
    );
  },
};

// Small container
export const Small = {
  render: (args) => {
    const Container = createContainerComponent({ ...args, maxWidth: 'sm' });
    return (
      <Container>
        <div style={{ backgroundColor: '#fef3c7', padding: '2rem', borderRadius: '8px' }}>
          <h3>Small Container</h3>
          <p>This container has a small max-width, suitable for narrow content like forms or cards.</p>
        </div>
      </Container>
    );
  },
};

// Full width container
export const FullWidth = {
  render: (args) => {
    const Container = createContainerComponent({ ...args, maxWidth: 'full' });
    return (
      <Container>
        <div style={{ backgroundColor: '#dbeafe', padding: '2rem', borderRadius: '8px' }}>
          <h3>Full Width Container</h3>
          <p>This container spans the full width of its parent.</p>
        </div>
      </Container>
    );
  },
};

// No padding
export const NoPadding = {
  render: (args) => {
    const Container = createContainerComponent({ ...args, padding: 'none' });
    return (
      <Container>
        <div style={{ backgroundColor: '#fce7f3', padding: '2rem' }}>
          <h3>No Padding Container</h3>
          <p>This container has no horizontal padding, allowing content to reach the edges.</p>
        </div>
      </Container>
    );
  },
};

// Not centered
export const NotCentered = {
  render: (args) => {
    const Container = createContainerComponent({ ...args, centered: false });
    return (
      <Container>
        <div style={{ backgroundColor: '#ecfccb', padding: '2rem', borderRadius: '8px' }}>
          <h3>Left-Aligned Container</h3>
          <p>This container is not centered and aligns to the left edge of its parent.</p>
        </div>
      </Container>
    );
  },
};

// Nested containers
export const Nested = {
  render: () => {
    const OuterContainer = createContainerComponent({ maxWidth: 'xl', padding: 'lg' });
    const InnerContainer = createContainerComponent({ maxWidth: 'md', padding: 'md' });
    
    return (
      <OuterContainer>
        <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '8px' }}>
          <h2>Outer Container (XL)</h2>
          <p>This is the outer container with XL max-width.</p>
          
          <InnerContainer>
            <div style={{ backgroundColor: '#e5e7eb', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
              <h3>Inner Container (MD)</h3>
              <p>This nested container has a smaller max-width, creating a narrower content area.</p>
            </div>
          </InnerContainer>
        </div>
      </OuterContainer>
    );
  },
};

// Showcase
export const Showcase = {
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb' }}>
      <h2 style={{ marginBottom: '2rem' }}>Container Sizes</h2>
      
      {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => {
        const Container = createContainerComponent({ maxWidth: size });
        return (
          <div key={size} style={{ marginBottom: '2rem' }}>
            <Container>
              <div style={{ 
                backgroundColor: '#3182ce', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <strong>{size.toUpperCase()}</strong> Container
              </div>
            </Container>
          </div>
        );
      })}
    </div>
  ),
};