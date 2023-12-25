import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AboutUs() {
    return (
    <>
        <Typography variant="h4" gutterBottom>
            About Us
        </Typography>
        
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: '100%',
                padding: 2
                },
            }}
        >
            <Paper elevation={4}>
                <Typography variant="h6" gutterBottom>
                    We made a big space for you, where you can create your own spaces.<br></br>
                    Inside each space you can create many task.<br></br>
                    You also can share you tasks to other guy who help you finish them.
                </Typography>
            </Paper>
            <Paper elevation={4}>
                <Typography variant="h5" gutterBottom>
                    Contact us:
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Email: info@meitoc.com
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Phone: +84 848484774
                </Typography>
            </Paper>
        </Box>
    </>);
}