import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Erlaubte Benutzerrollen (Rollenmodell)
export enum UserRole {
    BENUTZER = 'Benutzer',
    ADMINISTRATOR = 'Administrator',
}

// Interface für ein User-Dokument (US-01)
export interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    // Passwortvergleich für den Login (NFA-04)
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        // Pflichtfeld, unique, normalisiert (US-01)
        email: {
            type: String,
            required: [true, 'E-Mail-Adresse ist ein Pflichtfeld.'],
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Pflichtfeld, min. 6 Zeichen, wird gehasht gespeichert (US-01, NFA-04)
        password: {
            type: String,
            required: [true, 'Passwort ist ein Pflichtfeld.'],
            minlength: [6, 'Das Passwort muss mindestens 6 Zeichen lang sein.'],
            select: false, // wird nicht standardmäßig zurückgegeben
        },

        // Benutzerrolle mit Default 'Benutzer' (Rollenmodell)
        role: {
            type: String,
            enum: {
                values: Object.values(UserRole),
                message: `Rolle muss '${UserRole.BENUTZER}' oder '${UserRole.ADMINISTRATOR}' sein.`,
            },
            default: UserRole.BENUTZER,
        },

        // Sperrstatus: false = gesperrt, true = aktiv (US-14)
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Fügt createdAt und updatedAt automatisch hinzu
        timestamps: true,
    }
);

// Hasht das Passwort vor dem Speichern (NFA-04)
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Vergleicht Klartextpasswort mit gespeichertem Hash (NFA-04)
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
