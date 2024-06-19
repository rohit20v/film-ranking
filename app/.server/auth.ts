import bcrypt from 'bcrypt';

export const encrypt = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (inputPassword:string, storedEncryptedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, storedEncryptedPassword);
}