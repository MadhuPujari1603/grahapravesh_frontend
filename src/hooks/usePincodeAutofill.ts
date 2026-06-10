"use client";

import { useState, useCallback } from "react";

export interface PincodeData {
  city: string;     // Block (e.g. "Hubli")
  district: string; // District (e.g. "Dharwad")
  state: string;    // State (e.g. "Karnataka")
}

interface UsePincodeAutofill {
  fetchPincode: (pincode: string) => Promise<PincodeData | null>;
  isLoading: boolean;
  error: string | null;
}

export function usePincodeAutofill(): UsePincodeAutofill {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPincode = useCallback(async (pincode: string): Promise<PincodeData | null> => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return null;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        return {
          city:     po.Block    || po.Division || po.District, // Hubballi
          district: po.District || po.Division,                // Dharwad
          state:    po.State,                                  // Karnataka
        };
      }

      setError("Pincode not found. Please enter manually.");
      return null;
    } catch {
      setError("Failed to fetch pincode details");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchPincode, isLoading, error };
}
