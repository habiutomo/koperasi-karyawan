import { Helmet } from "react-helmet";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Shield, CreditCard, Bell, Globe, CircleDollarSign } from "lucide-react";

const profileFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  loanAlerts: z.boolean().default(true),
  savingsUpdates: z.boolean().default(true),
  dividendAnnouncements: z.boolean().default(true),
});

const systemSettingsSchema = z.object({
  currency: z.string().default("IDR"),
  language: z.string().default("en"),
  interestRate: z.string().min(1, "Interest rate is required."),
  loanTerms: z.string().min(1, "Loan terms are required."),
});

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });
  
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      loanAlerts: true,
      savingsUpdates: true,
      dividendAnnouncements: true,
    },
  });
  
  const systemSettingsForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      currency: "IDR",
      language: "en",
      interestRate: "5.5",
      loanTerms: "24",
    },
  });
  
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };
  
  const onSecuritySubmit = (values: z.infer<typeof securityFormSchema>) => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  const onNotificationsSubmit = (values: z.infer<typeof notificationsFormSchema>) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };
  
  const onSystemSettingsSubmit = (values: z.infer<typeof systemSettingsSchema>) => {
    toast({
      title: "System settings updated",
      description: "System settings have been updated successfully.",
    });
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Settings - Koperasi Karyawan</title>
      </Helmet>
      
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application preferences</p>
          </header>
          
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  {user?.role === "admin" && (
                    <TabsTrigger value="system" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      System
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="profile" className="py-4">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormDescription>
                              This email will be used for notifications and communications.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="security" className="py-4">
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 6 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="notifications" className="py-4">
                  <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Choose which notifications you want to receive</p>
                      </div>
                      
                      <Separator />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div>
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Receive general notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="loanAlerts"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div>
                              <FormLabel>Loan Alerts</FormLabel>
                              <FormDescription>
                                Get notified about loan status changes and payments
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="savingsUpdates"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div>
                              <FormLabel>Savings Updates</FormLabel>
                              <FormDescription>
                                Get notified about your savings account activity
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="dividendAnnouncements"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center">
                            <div>
                              <FormLabel>Dividend Announcements</FormLabel>
                              <FormDescription>
                                Get notified about dividend distributions
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Preferences
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                {user?.role === "admin" && (
                  <TabsContent value="system" className="py-4">
                    <Form {...systemSettingsForm}>
                      <form onSubmit={systemSettingsForm.handleSubmit(onSystemSettingsSubmit)} className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">System Settings</h3>
                          <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                          <FormField
                            control={systemSettingsForm.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="IDR">Indonesian Rupiah (Rp)</SelectItem>
                                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                                    <SelectItem value="EUR">Euro (€)</SelectItem>
                                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Default currency for financial calculations
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={systemSettingsForm.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Language</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="id">Indonesian</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Default language for the application
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium">Loan Settings</h3>
                          <p className="text-sm text-muted-foreground">Configure default loan parameters</p>
                        </div>
                        
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                          <FormField
                            control={systemSettingsForm.control}
                            name="interestRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Interest Rate (%)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <CircleDollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="text" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Annual interest rate for loans
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={systemSettingsForm.control}
                            name="loanTerms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Loan Term (months)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="text" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Default repayment period in months
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save System Settings
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
