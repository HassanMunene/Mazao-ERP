import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Unauthorized() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-destructive/15 p-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground">
                            You don't have permission to access this page.
                        </p>

                        {user ? (
                            <div className="bg-muted/50 p-3 rounded-lg mt-4">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Shield className="h-4 w-4" />
                                    <span>Logged in as: <strong>{user.email}</strong></span>
                                </div>
                                {user.role && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Role: {user.role}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                You may need to log in with different credentials.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild variant="default" className="gap-2">
                            <Link to="/">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="gap-2">
                            <Link to="/dashboard">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>

                        {!user && (
                            <Button asChild variant="secondary" className="gap-2">
                                <Link to="/login">
                                    Sign In with Different Account
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                        <p>If you believe this is an error, please contact your administrator.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}