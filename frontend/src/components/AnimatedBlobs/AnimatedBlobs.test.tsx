import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, vi } from 'vitest';
import AnimatedBlobs from './AnimatedBlobs';

let blobs: HTMLElement[];

describe('Blobs', () => {
  describe('Rendering', () => {
    render(<AnimatedBlobs />);
    blobs = screen.getAllByRole('img');

    test('Loads blobs and displays them', () => {
      expect(blobs).toHaveLength(2);
    });
  });

  describe('Changes styling after given amount of time', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      render(<AnimatedBlobs />);
      blobs = screen.getAllByRole('img');
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it.each(blobs)('Blob %# should have default styling', blob => {
      expect(blob).toHaveStyle({ borderRadius: '' });
    });

    it('Should update borderRadius to random number', () => {
      vi.advanceTimersByTime(5000);
      expect(blobs[0]).not.toHaveStyle('border-radius: 0');
      expect(blobs[1]).not.toHaveStyle('border-radius: 0');
    });
  });
});
