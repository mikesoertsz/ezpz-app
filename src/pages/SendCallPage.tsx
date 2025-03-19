import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initiateBlandCall } from "@/services/ezpzApi";
import { Contact, defaultContacts } from "@/types/contacts";
import { ContactSelector } from "@/components/ContactSelector";
import { ContactEditor } from "@/components/ContactEditor";
import { VoiceSelector } from "@/components/VoiceSelector";
import { Phone, Plus, Save, Trash2 } from "lucide-react";
import { availableVoices } from "@/types/voices";

const SendCallPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [editingContact, setEditingContact] = useState<Contact>({
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    company: "",
  });
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("0d13d946-b558-4b0d-8160-ce71c2a18c21");

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setEditingContact({ ...contact });
    }
  };

  const handleNewContact = () => {
    setSelectedContactId("");
    setEditingContact({
      id: `new-${Date.now()}`,
      name: "",
      phoneNumber: "",
      email: "",
      city: "",
      company: "",
    });
  };

  const handleSaveContact = () => {
    if (!editingContact.name || !editingContact.phoneNumber) {
      toast.error("Error", {
        description: "Name and phone number are required"
      });
      return;
    }

    const isNew = !contacts.some(c => c.id === editingContact.id);
    
    if (isNew) {
      setContacts(prev => [...prev, editingContact]);
      toast.success("Contact Created", {
        description: `${editingContact.name} has been added to contacts`
      });
    } else {
      setContacts(prev => 
        prev.map(c => c.id === editingContact.id ? editingContact : c)
      );
      toast.success("Contact Updated", {
        description: `${editingContact.name}'s information has been updated`
      });
    }
    
    setSelectedContactId(editingContact.id);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    if (selectedContactId === id) {
      setSelectedContactId("");
      handleNewContact();
    }
    toast.success("Contact Deleted");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact.phoneNumber) {
      toast.error("Error", {
        description: "Please provide a phone number"
      });
      return;
    }

    if (!selectedVoiceId) {
      toast.error("Error", {
        description: "Please select a voice for the call"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Initiating call to:', editingContact);
      
      const result = await initiateBlandCall({
        phoneNumber: editingContact.phoneNumber,
        voiceId: selectedVoiceId,
        task: `You are an AI assistant from EZPZ Recruitment. Your name is Josh. Call ${editingContact.name} and:
1. Introduce yourself politely and confirm you're speaking with ${editingContact.name}
2. Explain you're calling about potential job opportunities that match their profile
3. Ask if they have a few minutes to discuss some exciting opportunities
4. If they're interested, ask about their current role and what they're looking for in their next position
5. Thank them for their time and let them know someone from our team will follow up with more details
6. End the call professionally`,
        request_data: {
          name: editingContact.name,
          company: editingContact.company,
          email: editingContact.email
        },
      });

      console.log('Call initiated:', result);
      toast.success("Call Initiated", {
        description: `Successfully initiated call to ${editingContact.name}. Call ID: ${result.call_id}`
      });
    } catch (error) {
      console.error('Call initiation error:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to initiate call"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full">
      <div className="h-full rounded-xl bg-white border flex">
        {/* Left Sidebar */}
        <div className="w-[300px] border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-sm font-medium">Call Settings</h2>
            <p className="text-xs text-gray-500 mt-1">Configure your call parameters</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center">
                <ContactSelector
                  contacts={contacts}
                  selectedContactId={selectedContactId}
                  onSelect={handleContactSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNewContact}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ContactEditor
                contact={editingContact}
                onContactUpdate={setEditingContact}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleSaveContact}
                  variant="outline"
                  className="flex-1 text-xs h-8"
                  disabled={!editingContact.name || !editingContact.phoneNumber}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Contact
                </Button>
                {selectedContactId && (
                  <Button
                    type="button"
                    onClick={() => handleDeleteContact(selectedContactId)}
                    variant="outline"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <VoiceSelector
                voices={availableVoices}
                selectedVoiceId={selectedVoiceId}
                onSelect={setSelectedVoiceId}
              />

              <Button
                type="submit"
                disabled={isLoading || !editingContact.phoneNumber || !selectedVoiceId}
                className="w-full h-8 text-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    <span>Call {editingContact.name || "Contact"}</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Make Calls</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Configure your call settings in the sidebar to get started.
              The AI assistant will handle the conversation based on your configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCallPage;