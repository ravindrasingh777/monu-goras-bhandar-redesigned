"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../ui/toast";

const enquiryTypes = [
  "Home delivery",
  "Sweet shop supply",
  "Events and bookings",
  "Distributor inquiry",
  "Other",
];

export default function EnquiryForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [enquiry, setEnquiry] = useState(enquiryTypes[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const data = {
        name,
        mobile,
        enquiryFor: enquiry,
      };

      const response = await fetch("/api/sendMail", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const message = await response.json();

      if (message.flag === 1) {
        // alert(message?.msg || "Enquiry submitted successfully!");
        toast.add({
          type: "success",
          title: "Enquiry submitted!",
          description: message?.msg,
        });

        setName("");
        setMobile("");
        setEnquiry(enquiryTypes[0]);
      } else {
        alert(message?.msg || "Something went wrong!");
        toast.add({
          type: "error",
          title: "Enquiry submitted failed!",
          description: message?.msg,
        });
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      alert("Unable to submit your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl bg-card p-6 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input
            id="mobile"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            title="Enter a 10-digit mobile number"
            required
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10-digit number"
          />
        </div>
      </div>

      {/* Enquiry Type */}
      <div className="space-y-2">
        <Label htmlFor="enquiry">Enquiry for</Label>

        <Select
          value={enquiry}
          onValueChange={(value) => {
            if (value !== null) {
              setEnquiry(value);
            }
          }}
        >
          <SelectTrigger id="enquiry" className="w-full">
            <SelectValue placeholder="Select enquiry type" />
          </SelectTrigger>

          <SelectContent>
            {enquiryTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          "Submitting..."
        ) : (
          <>
            <FaWhatsapp className="mr-2" />
            Send enquiry
          </>
        )}
      </Button>
    </form>
  );
}
