// import { AuthenCheck } from '../../features/authentication/AuthenChe
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Policy() {
  return(
    <>
        <Typography variant="h4" gutterBottom>
          User Policy
        </Typography>
        <Box margin={2} padding={2}>
          <p>Last Updated: 2023-12-28</p>
          <h2>Welcome to our platform.</h2>
          <p>This User Policy governs your use of our services and outlines your rights and responsibilities as a user. By accessing or using our platform, you agree to comply with this User Policy. Please read it carefully.</p>
          
          <h3>1. Account Creation and Usage</h3>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to share your account credentials with any third party.</li>
            <li>You are solely responsible for all activities conducted through your account.</li>
          </ul>
          
          <h3>2. User Conduct</h3>
          <ul>
            <li>You agree to use our platform in compliance with all applicable laws and regulations.</li>
            <li>You must not engage in any activity that may disrupt or interfere with the proper functioning of our platform.</li>
            <li>You must not upload or transmit any content that is illegal, harmful, or violates the rights of others.</li>
            <li>You must respect the privacy of other users and not disclose their personal information without their consent.</li>
          </ul>
          
          <h3>3. Intellectual Property</h3>
          <ul>
            <li>Our platform and its contents are protected by intellectual property rights. You must not reproduce, modify, or distribute any copyrighted material without proper authorization.</li>
            <li>You retain ownership of the content you submit to our platform. However, by submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content within our platform.</li>
          </ul>
          
          <h3>4. Privacy</h3>
          <ul>
            <li>We respect your privacy and handle your personal information in accordance with our Privacy Policy.</li>
            <li>We may collect certain information from you when you use our platform. This information may include but is not limited to your name, email address, and usage data.</li>
          </ul>
          
          <h3>5. Disclaimer of Warranty</h3>
          <ul>
            <li>Our platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not make any warranties, express or implied, regarding the reliability, suitability, or availability of our platform.</li>
          </ul>
          
          <h3>6. Limitation of Liability</h3>
          <ul>
            <li>We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use our platform.</li>
          </ul>
          
          <h3>7. Modification of User Policy</h3>
          <ul>
            <li>We reserve the right to modify or update this User Policy at any time. Any changes will be effective immediately upon posting the updated User Policy on our platform.</li>
          </ul>
          
          <p>If you have any questions or concerns regarding this User Policy, please contact us at info@meitoc.net </p>
        </Box>
    </>
  );
}