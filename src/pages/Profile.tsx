
import UserProfile from "@/components/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <UserProfile />
    </div>
  );
};

export default Profile;
