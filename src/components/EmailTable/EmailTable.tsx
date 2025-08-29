import { emailsData } from '@/data/emailsData';
import RecipientsCell from '../RecipientsCell';

const EmailTable: React.FC = () => {
  return (
    <table className='text-left border border-separate overflow-scroll table-fixed truncate'>
      <thead>
        <tr>
          <th className='border p-2 w-1/5'>Remetentes</th>
          <th className='border p-2 w-1/5'>Destinatários</th>
          <th className='border p-2 w-3/5'>Mensagem</th>
        </tr>
      </thead>
      <tbody>
        {emailsData.map((email, index) => (
          <tr key={index}>
            <td className='border p-2 w-1/5'>{email.sender}</td>
            {/*
              The cell uses overflow-visible so that tooltips from the
              RecipientsCell component can extend beyond the bounds of
              the cell. Using overflow-hidden here would clip the tooltip.
            */}
            <td className='border p-2 w-1/5 overflow-visible'>
              {/*
                Use the RecipientsCell component to automatically truncate the
                list of email recipients based on available space. It shows
                an ellipsis and hidden count when necessary and displays a
                tooltip with the full list on hover.
              */}
              <RecipientsCell recipients={email.recipients} />
            </td>
            <td className='border p-2 w-3/5'>{email.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmailTable;

