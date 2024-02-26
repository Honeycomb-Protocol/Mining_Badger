import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  TableHeader,
  TableColumn,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Image,
} from "@nextui-org/react";

import { ModalProps } from "../../../interfaces";
import { tableData } from "@/lib/utils/constants";

const LevelsRequiredModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  return (
    <Modal
      className="!max-w-[70%] !max-h-[85%] !w-[90%] !h-[90%] bg-[#1D1D1D] "
      isOpen={visible}
      onOpenChange={setVisible}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center font-bold text-5xl">
              Levels Required For Pickaxes
            </ModalHeader>
            <ModalBody className="!w-full ">
              <Table removeWrapper className="!px-16 ">
                <TableHeader className="text-xl bg-black">
                  <TableColumn className="text-2xl bg-transparent text-[#CC634E] capitalize">
                    {` `}
                  </TableColumn>
                  <TableColumn className=" text-2xl bg-transparent text-[#CC634E] capitalize">
                    Pickaxe
                  </TableColumn>
                  <TableColumn className="px-32 text-2xl bg-transparent text-[#CC634E] capitalize">
                    Level
                  </TableColumn>
                  <TableColumn className=" text-2xl bg-transparent text-[#CC634E] capitalize">
                    Strength
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {tableData.map((data, index) => (
                    <TableRow
                      key={index}
                      className="gap-10 text-center border-b-2  border-gray-700 h-24"
                    >
                      <TableCell className="w-36  px-10">
                        <Image
                          src={data.image}
                          alt={data.pickaxe}
                          width={150}
                          height={150}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-start text-xl font-bold w-32">
                        {data.pickaxe}
                      </TableCell>
                      <TableCell className=" whitespace-nowrap px-32 text-start  text-xl font-bold ">
                        Level {data.level}
                      </TableCell>
                      <TableCell className="text-start text-sm  font-extralight">
                        {data.strength}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LevelsRequiredModal;
